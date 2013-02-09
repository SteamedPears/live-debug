module("Mather core");

test("Number parsing", function(){
    expect(5);
    equal(Mather.parse("1"),1,"parsing a single digit");
    equal(Mather.parse("123456789"),123456789,"parsing a big number");
    equal(Mather.parse("-20"),-20,"parsing a negative number");
    equal(Mather.parse("+31"),31,"parsing a positive number");
    equal(Mather.parse("(((17)))"),17,"parsing in parens");
});

test("Addition", function(){
    expect(5);
    equal(Mather.parse("1+0"),1,"identity");
    equal(Mather.parse("2+3"),5,"basic addition");
    equal(Mather.parse("1.5+3.25"),4.75,"addition of decimals");
    equal(Mather.parse("5+(-3)"),2,"addition of negatives");
    equal(Mather.parse("5+(-8)"),-3,"addition of negatives (negative result)");
});

test("Subtraction", function(){
    expect(5);
    equal(Mather.parse("1-0"),1,"identity");
    equal(Mather.parse("5-3"),2,"basic subtraction");
    equal(Mather.parse("2-7"),-5,"basic subtraction (negative result)");
    equal(Mather.parse("2.5-1.25"),1.25,"subtraction of decimals");
    equal(Mather.parse("5-(-8)"),13,"subtraction of negatives");
});

test("Multiplication", function(){
    expect(5);
    equal(Mather.parse("2*1"),2,"identity");
    equal(Mather.parse("2*3"),6,"basic multiplication");
    equal(Mather.parse("2*(-7)"),-14,"multiplying negatives");
    equal(Mather.parse("2.5*3.5"),8.75,"multiplication of decimals");
    equal(Mather.parse("5*0"),0,"multiply by 0");
});

test("Division", function(){
    expect(5);
    equal(Mather.parse("2/1"),2,"identity");
    equal(Mather.parse("6/2"),3,"basic division");
    equal(Mather.parse("3/2"),1.5,"basic division (decimal result)");
    equal(Mather.parse("5.5/2.5"),2.2,"division of decimals");
    equal(Mather.parse("8/(-4)"),-2,"division of negatives");
});

test("Order of Operations", function(){
    expect(3);
    equal(Mather.parse("2*3+5"),11,"mult beats add");
    equal(Mather.parse("4/2+5"),7,"div beats add");
    equal(Mather.parse("2+3-7"),-2,"basic subtraction (negative result)");
});

test("INTEGRATION", function(){
    equal(Mather.parse("1.5+3/2*(9-2*8/(-2)+9)-6/24"),40.25,"all the operations");
});
