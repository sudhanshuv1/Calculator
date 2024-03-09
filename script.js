function display(symbol){
    if(typeof symbol === 'number'){
        var numString = symbol.toString();
        var initialVal = document.getElementById('textDisplay').value;
        initialVal = initialVal.toString();
        initialVal = (initialVal === '0')? '' : initialVal;
        document.getElementById('textDisplay').value = initialVal+numString;
    }
    else{
        var initialVal = document.getElementById('textDisplay').value;
        initialVal = initialVal.toString();
        initialVal = (initialVal === '0' && symbol != '.')? '' : initialVal;
        document.getElementById('textDisplay').value = initialVal+symbol;
    }
    return;
}

function calculate(){
    var initialVal = document.getElementById('textDisplay').value;
    //initialVal = initialVal.toString();
    console.log(initialVal+initialVal.length);
    initialVal=inToPost(initialVal);
    var answer=evaluatePostFix(initialVal);
    document.getElementById('textDisplay').value = initialVal+'=';
    document.getElementById('textDisplay').value = answer;
    return;
}

function clearScreen(){
    document.getElementById('textDisplay').innerHTML = '0';
    document.getElementById('textDisplay').value = 0;
}

let Stack = class{
    #stackArray = Array();
    #top = -1;
    stackTop(){
        return this.#stackArray[this.#top];
    }
    push(item){
        this.#stackArray[++this.#top] = item;
    }
    pop(){
        if(!this.isEmpty()){
            return this.#stackArray[this.#top--];
        }
        else{
            return null;
        }
    }
    isEmpty(){
        return this.#top == -1;
    }
    printStack(){
        console.log('The stack is: ' + this.#stackArray);
    }
}

var inToPost = function(inExpr){
    var postExpr = Array();
    var stack = new Stack();
    var postIndex=0; 
    inExpr = inExpr.split("");
    let inIndex=0;
    while(inIndex < inExpr.length){
        if(inExpr[inIndex] === '-' && (isOperator(inExpr[inIndex-1]) || inIndex===0)){
            postExpr[postIndex++] = inExpr[inIndex++];
        }
        else if(!isNaN(inExpr[inIndex]) || inExpr[inIndex]=='.'){
            while(!isNaN(inExpr[inIndex]) || inExpr[inIndex]=='.'){
                postExpr[postIndex++] = inExpr[inIndex++];
            }
            postExpr[postIndex++] = ' ';
        }
        else{
            let top=stack.stackTop();
            while(!stack.isEmpty() && preced(top)>preced(inExpr[inIndex])){
                postExpr[postIndex++]=stack.pop();
                postExpr[postIndex++] = ' ';
                top=stack.stackTop();
            }
            stack.push(inExpr[inIndex]);
            stack.printStack();
            inIndex += 1;
        }
    }
    while(!stack.isEmpty()){
        postExpr[postIndex++]=stack.pop();
        postExpr[postIndex++] = ' ';
    }
    console.log(postExpr);
    return postExpr;
}

function evaluatePostFix(expr){
    var stack = new Stack();
    var index=0;
    while(index < expr.length){
        let negative=false;
        if(expr[index] === ' '){
            index += 1;
        }
        else if(!isNaN(expr[index]) || (expr[index] == '-' && expr[index+1] !== ' ') || expr[index] == '.'){
            let num = '';
            if(expr[index] == '-'){
                index += 1;
                negative=true;
            }
            while(!(isNaN(expr[index])) || expr[index] == '.'){
                if(expr[index] == ' '){
                    break;
                }
                num += expr[index++];
            }
            num=parseFloat(num);
            if(negative){
                num = 0-num;
            }
            stack.push(num);
            stack.printStack();
        }
        else{
            var num1=stack.pop();
            var num2=stack.pop();
            var result=operate(num1,num2,expr[index]);
            stack.push(result);
            index += 1;
        }
    }
    return stack.pop();
}

function preced(character){
    switch(character){
        case '-':
            return 1;
        case '+':
            return 2;
        case '*':
            return 3;
        case '/':
            return 4;
    }
    return null;
}

function operate(num2,num1,operator){
    switch(operator){
        case '-':
            return num1-num2;
        case '+':
            return num1+num2;
        case '*':
            return num1*num2;
        case '/':
            return num1/num2;
    }
    return null;
}

var isOperator = function(operator){
    return (operator == '+' || operator == '-' || operator == '*' || operator == '/');
}

