var Mather = (function(Mather){

    Mather.parse = function(input){
        return parse(input, current);
    }
    
    Mather.compare = function(input){
        var result = Mather.parse(input);
        var sample = eval(input);
        console.log((sample==result)+"; result:"+result+" - expected:"+sample);
    }
    
    var OPEN_PAREN = "(";
    var CLOSE_PAREN = ")";
    var NUMBERS = "0123456789.";
    
    //Shunting Yard, see: http://stackoverflow.com/a/47717
    var parse = function(input, computer){
        var operators = [];
        var numbers = [];
        var curNum = "";
        for(var i=0; i<input.length; i++){
            var cur = input.charAt(i);
            if(isNumber(cur)){
                curNum+=cur;
            }else{
                if(curNum.length>0){
                    numbers.push(parseFloat(curNum));
                    curNum = "";
                }
                if(isOperator(computer, cur)){
                    if(cur==OPEN_PAREN){
                        operators.push(cur);
                    }else if(cur==CLOSE_PAREN){
                        while(peek(operators)!=OPEN_PAREN){
                            performOperation(computer,numbers,operators);
                        }
                        operators.pop();
                    }else if(operators.length == 0 || isPrecedent(computer, cur, peek(operators))){
                        operators.push(cur);
                    }else{
                        performOperation(computer,numbers,operators);
                        i--;
                        continue;
                    }
                }
            }
        }
        if(curNum.length>0){
            numbers.push(parseFloat(curNum));
            curNum = "";
        }
        while(numbers.length>1){
            performOperation(computer,numbers,operators);
        }
        return numbers[0];
    }
    
    var performOperation = function(computer, numbers, operators){
        var second = numbers.pop();
        var first = numbers.pop();
        var operator = operators.pop();
        numbers.push(computer[operator](first,second))
    }
    
    var isOperator = function(computer, input){
        return !!computer.operators[input];
    }
    
    var getPrecedence = function(computer, input){
        return computer.operators[input];
    }
    
    var isPrecedent = function(computer, x, y){
        return getPrecedence(computer, x)>getPrecedence(computer, y);
    }
    
    var isNumber = function(input){
        return NUMBERS.indexOf(input)>-1;
    }
    
    var peek = function(stack){
        return stack.length>0 ? stack[stack.length-1] : null;
    }
    
    var working = {};
    var broken = {};
    var current = working;
    
    working["+"] = function(x,y){
        return x+y;
    }
    
    working["-"] = function(x,y){
        return x-y;
    }
    
    working["*"] = function(x,y){
        return x*y;
    }
    
    working["/"] = function(x,y){
        return x/y;
    }
    
    working.operators = {
        "(":1,
        ")":1,
        "*":3,
        "/":3,
        "+":2,
        "-":2
    }
    
    broken["+"] = [
        function(x,y){
            return x;
        }
    ]
    
    broken["-"] = function(x,y){
        return y-x;
    }
    
    broken["*"] = function(x,y){
        return y*y;
    }
    
    broken["/"] = function(x,y){
        return Math.round(x,y);
    }
    
    broken.operators = {
        "(":1,
        ")":1,
        "*":4,
        "/":3,
        "+":2,
        "-":1
    }
    
    return Mather;
})(Mather || {});
