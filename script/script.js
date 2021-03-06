function create_graph (recipe, recipe_ing, recipe_cal, ing_nut, scales){
    var recommend = [2000, 65, 300, 300, 25, 50, 50, 1000, 18, 5000, 60];
    //var scales = []
    d3.selectAll("line").remove();
    d3.selectAll("rect").remove();
    d3.selectAll(".axis").remove();
    d3.selectAll(".graph-text").remove();
    d3.selectAll(".totals").remove();
    var domain = findMax(recipe, recipe_ing, ing_nut, recipe_cal);
    create_axis(scales, domain);
    var nutrition_array = ['Energ_Kcal', 'Lipid_Tot', 'Cholestrl', 'Carbohydrt',
    'Fiber_TD', 'Sugar_Tot', 'Protein', 'Calcium', 'Iron', 'Vit_A', 'Vit_C'];
    var serving = ['kcal', 'g', 'mg', 'g', 'g', 'g', 'g', 'mg', 'mg', 'mg', 'mg'];
    var ing_full = recipe_ing[recipe];
    var calories = recipe_cal[recipe]['calories'];
    var ratio = 0;
    var ing_list = Object.keys(ing_full);
    for (var i = 0; i < nutrition_array.length; i++){
        var agg_x = 15;
        var agg_nutrients = 0;
        var max;
        if (ing_list.length > 12){
            max = 12;
        }
        else{
            max = ing_list.length;
        }
        for (var j = 0; j < max; j++){
            var ing = ing_list[j];
            var NDBNo = ing_full[ing]['NDBNo'];
            if (ing_nut[NDBNo]!=null){
                var amount_per = Number(ing_nut[NDBNo][nutrition_array[i]]);
                if (ing_full[ing]['unit']=="NA"){
                    if (ing.indexOf(" egg") != -1){
                         var amount_recipe = 1;
                         if (ing_full[ing]['magnitude'] > 10){
                            var amount_recipe =2;
                         }
                    }
                    else{
                        if (ing_full[ing]['magnitude'] == 0){
                            var amount_recipe = 1;
                        }
                        else {
                            var amount_recipe = ing_full[ing]['magnitude'];
                        }
                    }
                }
                else{
                     var amount_recipe = Number(ing_full[ing]['magnitude'])/100;
                }
                if (i == 0){
                    var tot_nutrients = Number(calories)/ing_list.length;
                    var color = "#3E59B3";
                }
                else{
                    var tot_nutrients = amount_recipe*amount_per*ratio;
                    var color = color_scale[j];
                }
                var class_name = ing.slice(6);
                class_name = class_name.replace(/\W/g, '');
                d3.select("#bars")
                .append("rect")
                .attr("class", class_name)
                .attr("id", "bar"+i + ", " + j)
                .attr("x", agg_x + 100)
                .attr("y", 75+ i*60)
                .attr("height", 20)
                .attr("width", scales[i](tot_nutrients))
                .attr("fill", "#3E59B3")
                .attr("stroke", "#3E59B3");
                agg_x += scales[i](tot_nutrients);
                if (i == 0){
                     agg_nutrients+=amount_per*amount_recipe;
                }
                else{
                    agg_nutrients+=amount_recipe*amount_per*ratio;
                }
            }
        }
        if (i == 0){
           ratio = calories/agg_nutrients;
           agg_nutrients = calories;

        }
        d3.select("#text")
        .append("text")
        .text(Math.trunc(agg_nutrients)+" " +serving[i]+" per serving")
        .attr("class", "totals")
        .attr("text-anchor", "end")
        .attr("x", 600)
        .attr("y", 90+i*60);

        console.log(nutrition_array[i] + recommend[i] + "," + scales[i](recommend[i]));
        d3.select("#bars")
        .append("line")
		.attr("id", "recommendLines"+i)
        .attr("x1", 115+ scales[i](recommend[i]))
        .attr("y1", 60+i*60)
        .attr("x2", 115 + scales[i](recommend[i]))
        .attr("y2", 100+i*60)
        .attr("stroke", "#49006a")
        .attr("stroke-width", 2);
    }


    d3.select("#text")
    .append("text")
    .text("Recommended Daily Value*")
    .attr("x", 115+ recommend[0])
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .attr("class", "graph-text")
    .attr("font-size", 10);

    d3.select("#text")
    .append("text")
    .text("*Recommended Daily Value numbers for micronutrients are static and based on the 2,000 calorie diet")
    .attr("x", 0)
    .attr("y", 720)
    .attr("font-size", 10)
    .attr("class", "graph-text");
}

function findMax(recipe, recipe_ing, ing_nut, recipe_cal){
	max = [[0,2500]];
    recommend = [2000, 65, 300, 300, 25, 50, 50, 1000, 18, 5000, 60];
    var nutrition_array = ['Energ_Kcal', 'Lipid_Tot', 'Cholestrl', 'Carbohydrt',
    'Fiber_TD', 'Sugar_Tot', 'Protein', 'Calcium', 'Iron', 'Vit_A', 'Vit_C'];
    //{ing1:{NDBNo:#, magnitude:#, unit: 'gram'}, ing2: {NDBNo:#, magnitude:#, unit: 'gram'}}
    var ing_full = recipe_ing[recipe];
    var ing_list = Object.keys(ing_full);
    for (var i = 0; i < nutrition_array.length; i++){
        var agg_x = 0;
        for (var j = 0; j < ing_list.length; j++){
            var ing = ing_list[j];
            var NDBNo = ing_full[ing]['NDBNo'];
            if (ing_nut[NDBNo]!=null){
                var amount_per = Number(ing_nut[NDBNo][nutrition_array[i]]);
                if (ing_full[ing]['unit']=="NA"){
                    if (ing.indexOf(" egg") != -1){
                         var amount_recipe = 1;
                         if (ing_full[ing]['magnitude'] > 10){
                            var amount_recipe =2;
                         }
                    }
                    else{
                        if (ing_full[ing]['magnitude'] == 0){
                            var amount_recipe = 1;
                        }
                        else {
                            var amount_recipe = ing_full[ing]['magnitude'];
                        }
                    }
                }
                else{
                     var amount_recipe = Number(ing_full[ing]['magnitude'])/100;
                }
            }
            if (i == 0){
                agg_x += Number(amount_recipe*amount_per);
            }
            else{
                agg_x += Number(amount_recipe*amount_per*ratio);
            }
        }
        if (i ==0){
            var ratio = recipe_cal[recipe]['calories']/agg_x;
        }
        else{
    		if (agg_x > recommend[i]){
    			max.push([0, agg_x*1.2]);
            }
            else {
                max.push([0, recommend[i]*1.2]);
            }
        }
    }
	return max;
}

function create_axis (scales, domain){
    var axes = [];
    for (i = 0; i < domain.length; i++){
        scale = d3.scaleLinear().domain(domain[i]).range([0, 400]);
        scales.push(scale);
        var axis = d3.axisTop(scale);
        var y_coord = i*60 + 63;

        d3.select("#text")
        .append("text")
        .attr("class", "graph-text")
        .text(nutrient_list[i])
        .attr("x", 0)
        .attr("y", y_coord + 18);

        d3.select("#axes")
        .append("g")
        .attr("class", "axis")
        .style("font-size", 11)
        .attr("transform", "translate(115, " + y_coord + ")" )
        .call(axis);
    }
}


