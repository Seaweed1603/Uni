program HelloWorld;
uses crt;

const
message = 'Welcome to the world of Pascal:D';

type
name = string;

var
first, last: name;

begin
   writeln('Whats your first name?');
   readln(first);

   writeln('Whats your last name?');
   readln(last);

   writeln;
   writeln(message, ', ', first, ' ', last, '!');
   readkey;
end.