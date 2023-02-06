let data;
let characters = [];
let charactersData;
let preparedData = [];
let streamData = [];
let characterList = ['Merry', 'Pippin', 'Aragorn', 'Faramir', 'Legolas', 'Gimli', 'Frodo', 'Eomer', 'Gandalf', 'Bilbo', 'Boromir', 'Galadriel', 'Isildur', 'Gollum', 'Saruman', 'Sauron'];
let chapterList = new Set();
let donutData = [];
let barData = [];
const charactersColor = {
    Merry : '#20A6A1',
    Pippin: '#209ba6',
    Aragorn: '#2092a6',
    Faramir: '#2087a6',
    Legolas: '#207ea6',
    Gimli: '#2077a6',
    Frodo: '#206aa6',
    Eomer: '#205fa6',
    Gandalf: '#204fa6',
    Bilbo: '#203fa6',
    Boromir: '#673eba',
    Galadriel: '#6b3eba',
    Isildur: '#763eba',
    Gollum: '#913eba',
    Saruman: '#ae3eba',
    Sauron: '#ba3ea5',
}

const bookColors = {
    'The Return Of The King': '#3aaec5',
    'The Fellowship Of The Ring': '#3ac58b',
    'The Two Towers': '#61c53a'
}

d3.csv("./public/lotr_characters.csv")
    .row(function(d) { return {
        gender: d["gender"],
        name: d["name"],
        race: d["race"]
    };
    }).get(function(error, rows) {
    charactersData = rows;
});

d3.csv("./public/WordsByCharacter.csv")
    .row(function(d) { return {
        book: d["Book"],
        chapter: d["Chapter"],
        character: d["Character"],
        race: d["Race"],
        words: d["Words"]
    };
    }).get(function(error, rows) {
    data = rows;
    init();
});

function init() {

    let width = screen.width;
    let height = screen.height;
    prepareData();
    console.log(data);
    visualize(streamData);

}

function prepareData(){
    let previousChapter = data[0].chapter;
    preparedData[previousChapter] = [];
    let i = 0;
    streamData[0] = [];
    streamData[0].chapter = i;
    chapterList.add(previousChapter);
    characterList.forEach(character => {
        donutData[character] = [];
        barData[character] = [];
    })
    data.forEach(row => {
        let currentChapter = row['chapter'];
        let character = row['character'];
        let book = row['book'];
        chapterList.add(currentChapter);
        if (currentChapter != previousChapter){
            i++;
            streamData[i] = {};
            streamData[i].chapter = i;
            previousChapter = currentChapter;
        }
        if(characterList.includes(character)){
            if (typeof donutData[character][book] == 'undefined') {
                donutData[character][book] = 0;
                barData[character][book] = [];
            }
            let id = barData[character][book].length;
            barData[character][book][id] = {chapter: currentChapter,
                                            words: parseInt(row['words'])};
            donutData[character][book] += parseInt(row['words']);
            streamData[i][character] = row['words'];
        }
    })
    for (let k = 0; k < streamData.length; ++k){
        characterList.forEach(character => {
            if(typeof streamData[k][character] == 'undefined'){
                streamData[k][character] = 0;
            }
        })
    }
    charactersData.forEach(row => {
        let race = row['race'];
        characters[row['name']] = {
            race: race,
            gender:row['gender']
        }
    })
    //console.log(characters)
    //console.log(streamData);
    //console.log(donutData);
    //console.log(barData);
}

function visualize(data) {
    var margin = {top: 20, right: 30, bottom: 0, left: 10},
        width = 1250 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("text-align", "center")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    var keys = characterList;
    var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) {
            return d.chapter; }))
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", "translate(0," + height*0.8 + ")")
        .call(d3.axisBottom(x).tickSize(-height*.7).tickValues([46, 112]))
        .select(".domain").remove()

    Book1 = svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 150)
        .attr("y", -5)
        .style("opacity", 0.6)
        .text("The Fellowship Of");
    Book2 = svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 150)
        .attr("y", 13)
        .text("The Ring")
        .style("opacity", 0.6);

    Book3 = svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 530)
        .attr("y", -5)
        .style("opacity", 0.6)
        .text("The Two Towers");

    Book4 = svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 950)
        .attr("y", -5)
        .text("The Return Of")
        .style("opacity", 0.6);
    Book5 = svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 950)
        .attr("y", 13)
        .text("The King")
        .style("opacity", 0.6);

    // Customization
    svg.selectAll(".tick line").attr("stroke", "#b8b8b8")
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width/2+5)
        .attr("y", height-30 )
        .text("Chapter");
    var y = d3.scaleLinear()
        .domain([-300, 300])
        .range([ height, 0 ]);
    var stackedData = d3.stack()
        .offset(d3.stackOffsetSilhouette)
        .keys(keys)
        (data)
    var Tooltip = svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", width/2+5)
        .attr("y", 5)
        .attr("class", "characterName")
        .style("opacity", 0)
        .style("font-size", 30)

    var RaceTooltip = svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", width/2+5)
        .attr("y", 28)
        .style("opacity", 0)
        .style("font-size", 17)

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
        Tooltip.style("opacity", 1)
        RaceTooltip.style("opacity", 1)
        Book1.style("opacity", 0)
        Book2.style("opacity", 0)
        Book3.style("opacity", 0)
        Book4.style("opacity", 0)
        Book5.style("opacity", 0)
        d3.selectAll(".myArea").style("opacity", .2)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }
    var mousemove = function(d,i) {
        grp = keys[i]
        Tooltip.text(grp)
        RaceTooltip.text(characters[grp]['race'])
    }
    var mouseleave = function(d) {
        Tooltip.style("opacity", 0)
        RaceTooltip.style("opacity", 0)
        d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
        Book1.style("opacity", 0.6)
        Book2.style("opacity", 0.6)
        Book3.style("opacity", 0.6)
        Book4.style("opacity", 0.6)
        Book5.style("opacity", 0.6)
    }
    var area = d3.area()
        .x(function(d) { return x(d.data['chapter']); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })
    svg
        .selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("class", "myArea")
        .style("fill", function(d) { return charactersColor[d.key]; })
        .attr("d", area)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on("click", function (d, i){
            drawDonutChart(d.key);
            d3.select("#bar_chart").select("svg").remove();
        })
}

function drawDonutChart(character){
    var width = 670
    height = 300
    margin = 0
    d3.select("#donut_chart").select("svg").remove();
    var radius = Math.min(width, height) / 2 - margin
    var svg = d3.select("#donut_chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + (width / 2) + "," + height / 2 + ")");

    document.getElementById("character_name").innerHTML = character;
    document.getElementById("character_race").innerHTML = characters[character]['race'];

    var data = donutData[character];
    let total = 0;
    if (typeof data['The Fellowship Of The Ring'] != 'undefined'){
        total += data['The Fellowship Of The Ring']
    }
    if (typeof data['The Two Towers'] != 'undefined'){
        total += data['The Two Towers']
    }
    if (typeof data['The Return Of The King'] != 'undefined'){
        total += data['The Return Of The King']
    }

// Compute the position of each group on the pie:
    var pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(function(d) {
            return d.value; })
    var data_ready = pie(d3.entries(data))

// The arc generator
    var arc = d3.arc()
        .innerRadius(radius * 0.5)         // This is the size of the donut hole
        .outerRadius(radius * 0.8)

// Another arc that won't be drawn. Just for labels positioning
    var outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)

    var mouseover = function(d) {
        d3.selectAll(".donutArea").style("opacity", .2)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
        Tooltip.text(d.value)
    }
    var mouseleave = function(d) {
        d3.selectAll(".donutArea").style("opacity", 1).style("stroke", "white")
        d3.select(this)
            .style("stroke", "white")
            .style("opacity", 1)
        Tooltip.text(total)
    }

    var Tooltip = svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", -10)
        .style("opacity", 1)
        .style("font-size", 30)
        .text(total)
    svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 20)
        .style("opacity", 1)
        .style("font-size", 30)
        .text('words')

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
        .selectAll('allSlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr("class", "donutArea")
        .attr('d', arc)
        .attr('fill', function(d){ return(bookColors[d.data.key]) })
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)
        .on("click", function(d){
            drawBarChart(character, d.data.key, d.data.value);
        })


// Add the polylines between chart and labels:
    svg
        .selectAll('allPolylines')
        .data(data_ready)
        .enter()
        .append('polyline')
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', function(d) {
            var posA = arc.centroid(d) // line insertion in the slice
            var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
            var posC = outerArc.centroid(d); // Label position = almost the same as posB
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
            posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
            return [posA, posB, posC]
        })

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width)
        .attr("y", height-30 )
        .text("Chapter");


// Add the polylines between chart and labels:
    svg
        .selectAll('allLabels')
        .data(data_ready)
        .enter()
        .append('text')
        .text( function(d) { console.log(d.data.key) ; return d.data.key } )
        .attr('transform', function(d) {
            var pos = outerArc.centroid(d);
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            return 'translate(' + pos + ')';
        })
        .style('text-anchor', function(d) {
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
        })
}

function drawBarChart(character, book, total){
    console.log(book);
    console.log(character);
    d3.select("#bar_chart").select("svg").remove();
    var data = barData[character][book];

// set the dimensions and margins of the graph
    var margin = {top: 50, right: 30, bottom: 70, left: 60},
        width = 500 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
    var svg = d3.select("#bar_chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + (margin.top+20) + ")");

// Initialize the X axis
    var x = d3.scaleBand()
        .range([ 0, width ])
        .padding(0.2);
    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + (height-100) +")")
        .attr("class", "barX")

// Initialize the Y axis
    var y = d3.scaleLinear()
        .range([(height-100), 0]);
    var yAxis = svg.append("g")
        .attr("class", "myYaxis")


// A function that create / update the plot for a given variable:
    function update(data) {

        svg
            .append("text")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", -35)
            .style("opacity", 1)
            .style("font-size", 20)
            .text(book)
        svg
            .append("text")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", -15)
            .style("opacity", 1)
            .style("font-size", 13)
            .text(total + " words")

        // Update the X axis
        x.domain(data.map(function(d) { return d.chapter; }))
        xAxis.call(d3.axisBottom(x))

        // Update the Y axis
        y.domain([0, d3.max(data, function(d) { return d.words }) ]);
        yAxis.transition().duration(500).call(d3.axisLeft(y));

        // Create the u variable
        var u = svg.selectAll("rect")
            .data(data)

        u
            .enter()
            .append("rect") // Add a new rect for each new elements
            .merge(u) // get the already existing elements as well
            .transition() // and apply changes to all of them
            .duration(500)
            .attr("x", function(d) { return x(d.chapter); })
            .attr("y", function(d) { return y(d.words); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - 100 - y(d.words); })
            .attr("fill", bookColors[book])

        // If less group in the new dataset, I delete the ones not in use anymore
        u
            .exit()
            .remove()
    }

// Initialize the plot with the first dataset
    update(data)
}