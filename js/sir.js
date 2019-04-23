d3.select('#infectivity_rate').append("input")
  .attr("class","slider")
  .attr("id","infectivty_rate_step")
  .attr("type","range")
  .attr("min",0)
  .attr("max",1)
  .attr("step","0.01")
  .attr("value",0.01);

d3.select('#total_population').append("input")
  .attr("class","slider")
  .attr("id","total_population_step")
  .attr("type","range")
  .attr("min",10)
  .attr("max",1000)
  .attr("step","1")
  .attr("value",350);

d3.select('#contact_frequency').append("input")
  .attr("class","slider")
  .attr("id","contact_frequency_step")
  .attr("type","range")
  .attr("min",0)
  .attr("max",100)
  .attr("step","1")
  .attr("value",10);

d3.select('#infection_duration').append("input")
  .attr("class","slider")
  .attr("id","infection_duration_step")
  .attr("type","range")
  .attr("min",1)
  .attr("max",20)
  .attr("step","1")
  .attr("value",7);



sirs_model();




function sirs_model(){
  var sir_system = new System(),
      timeline = sir_system.timeline,
      infectivity_rate = 0.01,
      contact_frequency = 10,
      population_infected = 1,
      average_duration_of_infection = 7,
      population_recovered = 0,
      population = 100;
      // susceptible_contacts = susceptible_population * contact_frequency,
      // contacts_between_infected_and_uninfected = susceptible_contacts * probability_of_contacts,
      // infectivity_rate = contacts_between_infected_and_uninfected * infectivity,
      // susceptible_population = population*timeline,
      // population_infected = infectivity_rate - recovery_rate,
      // recovery_rate = population_infected / average_duration_of_infection,
      // probability_of_contacts = population_infected / population,
      // population_recovered = recovery_rate;


  var infectionRate = sir_system.makeFlow({
    expression: function (tStep) {
      var result = stockSusceptible.getValue(tStep) * contact_frequency * (stockInfected.getValue(tStep)/population) * infectivity_rate;
      return result;
    }
  });

  var recoveryRate = sir_system.makeFlow({
    expression: function (tStep){
      var res = stockInfected.getValue(tStep) / average_duration_of_infection;
      return res;
    }
  });
  var stockSusceptible = sir_system.makeStock({
    outFlows: [infectionRate],
    initialize: function(){return population;}
  });

  var stockInfected = sir_system.makeStock({
    inflows:[infectionRate],
    outFlows: [recoveryRate],
    initialize: function(){return population_infected;}
  });

  var stockRecovered = sir_system.makeStock({
    inFlows:[recoveryRate],
    initialize: function(){return population_recovered;}
  });

  d3.select("#infectivity_rate_step").on("input", function() {
    infectivity_rate = +this.value;
    // console.log('infection_rate' infection_rate);
    sir_system.update();
  });
  d3.select("#contact_frequency_step").on("input", function() {
    contact_frequency =+ this.value ;
    system_1.update();
  });
  d3.select("#total_population_step").on("input", function() {
    total_population = +this.value;
    sir_system.update();
  });
  d3.select('#infection_duration').on("input", function(){
    average_duration_of_infection = +this.value;
    sir_system.update();
  });

  sir_system.update();

  var stock_infected_graph = sir_system.addGraph({
    containerDivClass: 'graph_outFlow9_D',
    data: [stockSusceptible],
    height: 300,
    stackData: true,
    styleClass: "flow dark"
  });

  var stock_infected_graph = sir_system.addGraph({
    containerDivClass: 'graph_outFlow9_B',
    data: [stockInfected],
    height: 300,
    stackData: true,
    styleClass: "flow dark"
  });


    var stock_recovered_graph = sir_system.addGraph({
      containerDivClass: 'graph_stock9_AB',
      data: [stockRecovered],
      height: 300,
      stackData: true,
      styleClass: "flow dark"
    });

    var stock_susceptible_svg = d3.selectAll('#Rectangle-4');
    var graph_s = sir_system.addGraph({
    svg: stock_susceptible_svg,
    classes: [ "graph", "stock"],
    showAxis: 'false',
    showAxis2: 'false',
    data: [stockSusceptible],
    interpolation: 'cardinal',
    height: parseInt(stock_susceptible_svg.select("rect").node().getBBox().height ),
    width: parseInt(stock_susceptible_svg.select("rect").node().getBBox().width ),
    xPos: parseInt(stock_susceptible_svg.select("rect").node().getBBox().x ),
    yPos: parseInt(stock_susceptible_svg.select("rect").node().getBBox().y ),
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    stackData: false
    });

  var stock_infected_svg = d3.selectAll('#Rectangle-3');
  var graph_i = sir_system.addGraph({
  svg: stock_infected_svg,
  classes: [ "graph", "stock"],
  showAxis: 'false',
  showAxis2: 'false',
  data: [stockInfected],
  interpolation: 'cardinal',
  height: parseInt(stock_infected_svg.select("rect").node().getBBox().height ),
  width: parseInt(stock_infected_svg.select("rect").node().getBBox().width ),
  xPos: parseInt(stock_infected_svg.select("rect").node().getBBox().x ),
  yPos: parseInt(stock_infected_svg.select("rect").node().getBBox().y ),
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  stackData: false
  });

  var stock_recovered_svg = d3.selectAll('#Rectangle-2');
  var graph_r = sir_system.addGraph({
  svg: stock_recovered_svg,
  classes: [ "graph", "stock"],
  showAxis: 'false',
  showAxis2: 'false',
  data: [stockRecovered],
  interpolation: 'cardinal',
  height: parseInt(stock_recovered_svg.select("rect").node().getBBox().height ),
  width: parseInt(stock_recovered_svg.select("rect").node().getBBox().width ),
  xPos: parseInt(stock_recovered_svg.select("rect").node().getBBox().x ),
  yPos: parseInt(stock_recovered_svg.select("rect").node().getBBox().y ),
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  stackData: false
  });
}
