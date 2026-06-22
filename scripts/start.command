#!/usr/bin/env bash
# MD2PPT Startup Script — macOS (bash + embedded Perl HTTP server, zero deps)
# Double-click in Finder to launch. Perl is pre-installed on every macOS.
set -e
PORT=5173
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
URL="http://localhost:$PORT"

# ── Check if already running ──────────────────────────────────────
if lsof -i ":$PORT" -sTCP:LISTEN -t &>/dev/null; then
    echo "MD2PPT is already running at $URL"
    open "$URL"
    read -p "Press Enter to close..."
    exit 0
fi

echo "MD2PPT — $URL"
echo "Close this terminal to stop the server"
echo ""

# ── Embedded Perl HTTP server ─────────────────────────────────────
# IO::Socket::INET is Perl core since 5.004 (1997). No modules needed.
exec perl - "$PORT" "$SCRIPT_DIR" <<'PERL'
use strict;
use warnings;
use IO::Socket::INET;
my($port,$root)=@ARGV;

my%mime=(html=>"text/html; charset=utf-8",js=>"application/javascript",
  css=>"text/css",md=>"text/markdown; charset=utf-8",
  png=>"image/png",jpg=>"image/jpeg",jpeg=>"image/jpeg",
  svg=>"image/svg+xml",webp=>"image/webp",gif=>"image/gif",
  mp4=>"video/mp4",webm=>"video/webm",ico=>"image/x-icon",json=>"application/json");

sub ct{my($e)=$_[0]=~/\.([^.]+)$/;$e?($mime{lc$e}||"application/octet-stream"):"application/octet-stream"}

sub safe{my$p="$root$_[0]";$p=~s!/\.(?=/|$)!!g;1 while$p=~s!/[^/]+/\.\.(?=/|$)!!g;$p=~/^\Q$root\E/&&-f$p?$p:undef}

sub res{my($c,$b,$t)=@_;$t||="text/plain; charset=utf-8";
  my$s={200=>"OK",404=>"Not Found"}->{$c}||"OK";
  "HTTP/1.1 $c $s\r\nContent-Type: $t\r\nContent-Length: ".length($b)."\r\nConnection: close\r\n\r\n$b"}

my$s=IO::Socket::INET->new(LocalAddr=>"0.0.0.0",LocalPort=>$port,Proto=>"tcp",Listen=>5,ReuseAddr=>1)
  or die"Cannot bind port $port: $!\n";
print"Listening on $port\n";

# Open browser (fork so it doesn't block)
if(fork()==0){sleep 0.3;exec"open","http://localhost:$port";exit}
waitpid(-1,&WNOHANG);

while(my$c=$s->accept()){my$l=<$c>;next unless$l;
  my($m,$p)=split' ',$l;next unless$m&&$m eq"GET";
  $p="/assets/index.html"if$p eq"/"||$p eq"/index.html";$p=~s/\?.*$//;
  my$f=safe($p);
  if($f){open(my$fh,"<:raw",$f)||(print$c res(500,$!));my$b=do{local$/;<$fh>};print$c res(200,$b,ct($f))}
  else{print$c res(404,"Not Found")}
  close$c
}
PERL
