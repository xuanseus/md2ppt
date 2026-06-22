#!/usr/bin/env bash
# MD2PPT Startup Script — Linux (bash + embedded Perl HTTP server, zero deps)
set -e
PORT=5173
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
URL="http://localhost:$PORT"

# ── Check if already running ──────────────────────────────────────
if command -v lsof &>/dev/null && lsof -i ":$PORT" -sTCP:LISTEN -t &>/dev/null; then
    echo "MD2PPT is already running at $URL"
elif command -v ss &>/dev/null && ss -tlnp 2>/dev/null | grep -q ":$PORT "; then
    echo "MD2PPT is already running at $URL"
else
    echo "MD2PPT — $URL"
    echo "Close this terminal to stop the server"
    echo ""
    xdg-open "$URL" 2>/dev/null || true
    exec perl - "$PORT" "$SCRIPT_DIR" <<'PERL'
use strict;
use warnings;
use IO::Socket::INET;

my $port   = shift || 5173;
my $root   = shift || ".";

my %mime = (
  html=>"text/html; charset=utf-8", js=>"application/javascript",
  css=>"text/css", md=>"text/markdown; charset=utf-8",
  png=>"image/png", jpg=>"image/jpeg", jpeg=>"image/jpeg",
  svg=>"image/svg+xml", webp=>"image/webp", gif=>"image/gif",
  mp4=>"video/mp4", webm=>"video/webm", ico=>"image/x-icon", json=>"application/json",
);

sub ct { my($e)=$_[0]=~/\.([^.]+)$/; $e?($mime{lc$e}||"application/octet-stream"):"application/octet-stream" }

sub safe { my $p="$root$_[0]"; $p=~s!/\.(?=/|$)!!g; 1 while$p=~s!/[^/]+/\.\.(?=/|$)!!g; $p=~/^\Q$root\E/&&-f$p?$p:undef }

sub res {
  my($c,$b,$t)=@_;$t||="text/plain; charset=utf-8";
  my$s={200=>"OK",404=>"Not Found",500=>"Error"}->{$c}||"OK";
  "HTTP/1.1 $c $s\r\nContent-Type: $t\r\nContent-Length: ".length($b)."\r\nConnection: close\r\n\r\n$b"
}

my $srv=IO::Socket::INET->new(LocalAddr=>"0.0.0.0",LocalPort=>$port,Proto=>"tcp",Listen=>5,ReuseAddr=>1)
  or die"Cannot bind port $port: $!\n";
print "Listening on $port\n";

while(my$c=$srv->accept()){
  my$l=<$c>;next unless$l;
  my($m,$p)=split' ',$l;next unless$m&&$m eq"GET";
  $p="/assets/index.html"if$p eq"/"||$p eq"/index.html";
  $p=~s/\?.*$//; my$f=safe($p);
  if($f){open(my$fh,"<:raw",$f)||(print$c res(500,$!));my$b=do{local$/;<$fh>};print$c res(200,$b,ct($f))}
  else{print$c res(404,"Not Found")}
  close$c
}
PERL
fi

# ── Open browser ──────────────────────────────────────────────────
xdg-open "$URL" 2>/dev/null || true
