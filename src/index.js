(function(Mather, $){
    $(function(){
        var $form = $("#input");
        var $input = $("#input-field");
        var $output = $("#output");
        
        $input.autosize();
        
        $form.on("submit",function(){
            $output.empty();
            var inputs = $input.val().split("\n");
            for(var i=0; i<inputs.length; i++){
                var input = inputs[i];
                if(input.trim().length==0 || input.indexOf("=")==-1){
                    continue;
                }
                var output;
                try{
                    var eqnParts = input.split("=");
                    var formula = eqnParts[0].trim();
                    var expectation = parseFloat(eqnParts[1].trim());
                    output = Mather.parse(formula); 
                }catch(ex){
                    output = undefined;
                }
                $output.append(makeRecord(formula, expectation, output));
            }
            return false;
        });
        
        $("#randomize").on("click",Mather.randomize);
    
    });
    
    function makeRecord(formula, expectation, output){
        var $record = $("<div>");
        var text;
        if(expectation==output || (isNaN(expectation) && isNaN(output))){
            $record.addClass("alert-success");
            text = "Yes: "+formula+" = "+expectation;
        }else{
            $record.addClass("alert-danger");
            text = "No:  "+formula+" = "+output+" (Expected: "+expectation+")";
        }

        $record.text(text);
        return $record;
    }
})(Mather, window.jQuery);
