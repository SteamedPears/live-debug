var Mather = (function(Mather){

    Mather.minBrokeness = 2;
    Mather.maxBrokeness = 3;

    Mather.parse = function(input){
        return parse(input, current);
    }
    
    Mather.getBrokenessID = function(){
        var result="";
        for(var key in current){
            var index = broken[key].indexOf(current[key]);
            result+=index;
        }
        return result;
    }
    
    Mather.randomize = function(){
        current = {};
        var brokenCount = 0;
        while(brokenCount<Mather.minBrokeness || brokenCount>Mather.maxBrokeness){
            brokenCount = 0;
            for(var key in working){
                var val;
                if(Math.random()>0.5){
                    val = working[key];
                }else{
                    brokenCount++;
                    val = broken[key];
                }
                if(val instanceof Array){
                    val = val[Math.floor(Math.random()*val.length)];
                }
                current[key] = val;
            }
        }
    }
    
    var OPEN_PAREN = "(";
    var CLOSE_PAREN = ")";
    var PLUS = "+";
    var MINUS = "-";
    var TIMES = "*";
    var DIVIDE = "/";
    
    //Shunting Yard, see: http://stackoverflow.com/a/47717
    var parse = function(input, computer){
        var operators = [];
        var numbers = [];
        var curNum = "";
        for(var i=0; i<input.length; i++){
            var cur = input.charAt(i);
            if(isNumber(computer, cur)){
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
                        if(i>0){
                            var prev = input.charAt(i-1);
                            if(!isOperator(computer, prev) || prev==CLOSE_PAREN){
                                operators.push(cur);
                                continue;
                            }
                        }
                        if(isSign(computer, cur)){
                            curNum+=cur;
                        }else{
                            throw "Could not parse input";
                        }
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
    
    var isNumber = function(computer, input){
        return computer.numbers.indexOf(input)>-1;
    }
    
    var isSign = function(computer, input){
        return input==PLUS || input==MINUS;
    }
    
    var peek = function(stack){
        return stack.length>0 ? stack[stack.length-1] : null;
    }
    
    var working = {};
    var broken = {};
    var current = working;
    
    working[PLUS] = function(x,y){
        return x+y;
    }
    
    working[MINUS] = function(x,y){
        return x-y;
    }
    
    working[TIMES] = function(x,y){
        return x*y;
    }
    
    working[DIVIDE] = function(x,y){
        return x/y;
    }
    
    //precedence; ( and ) must always be smallest
    working.operators = {
        "(":1,
        ")":1,
        "*":3,
        "/":3,
        "+":2,
        "-":2
    }
    
    working.numbers = "0123456789.";
    
    broken[PLUS] = [
        function(x,y){
            return x;
        },
        function(x,y){
            return y+y;
        },
        function(x,y){
            return x+1;
        }
    ]
    
    broken[MINUS] = [
        function(x,y){
            return y-x;
        },
        function(x,y){
            return x-1;
        },
        function(x,y){
            return Math.abs(x-y);
        }
    ]
    
    broken[TIMES] = [
        function(x,y){
            return y*y;
        },
        function(x,y){
            return Math.abs(x*y);
        }
    ]
    
    broken[DIVIDE] = [
        function(x,y){
            return Math.round(x/y);
        },
        function(x,y){
            return y/x;
        }
    ]
    
    broken.operators = [
        {
            "(":1,
            ")":1,
            "*":5,
            "/":4,
            "+":3,
            "-":2
        },
        {
            "(":1,
            ")":1,
            "*":2,
            "/":2,
            "+":2,
            "-":2
        }
    ]
    
    broken.numbers = [
        "0123456789"
    ]
    
    return Mather;
})(Mather || {});
