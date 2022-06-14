function SearchBar() {
    this.name = 'Internet users by country (as a % of population)';
    this.id = 'world-internet-users-2010-2020';
    this.title = 'Percentage of population using the internet, by country (2010-2020)';
    this.loaded = false;
    let inputBox;
    let searchToken = true;
    let queryLength;
    let countries;
    let top5 = '';
    this.xAxisLabel = 'year';
    this.yAxisLabel = '% of population using internet services';
    var marginSize = 35;

    this.minUsers = 0;
    this.maxUsers = 100;

    this.startYear = 2010;
    this.endYear = 2020;
    

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function() {
        var self = this;
        this.data = loadTable(
            './data/internet-users/WORLD_BANK_PERCENTAGE_OF_POPULATION_INTERNET_USERS.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function(table) {
                self.loaded = true;
            });
    }


    this.setup = function() {
        // Font defaults.
        textSize(16);
    
        // Set min and max years: assumes data is sorted by date.
        this.startYear = 2010
        this.endYear = 2020
    };


    this.drawTitle = function() {
        fill(0);
        noStroke();
        textAlign('center', 'center');
        textSize(25)
        text(this.title, width/2, height/40);
    };


    this.createSearchBar = function() {
        // search bar label
        textSize(18);
        strokeWeight(0.1)
        strokeCap(ROUND)
        stroke(0,0,152);
        text('Search for your desired country!', width/7.5, height/8);
        
        // render the search bar to the screen
        if (searchToken == true) {
            inputBox = createInput('');
            inputBox.position(width/3.12, height/8 + 25);
            inputBox.size(215);
            searchToken = false; // ensures the input box and button are only drawn once, allowing text input in the box to persist
        }

        // save the search query to a variable
        let query = inputBox.value();
        
        // check if the user as input anything and if the input has changed, if so call searchForQuery
        if (query.length > 0 && query.length != queryLength){
            this.searchForQuery(query)
            queryLength = query.length
        }   
    };


    // takes the search query as an input and filters matches from the countries column
    this.searchForQuery = function(searchQuery) {
        function filterCountries(countriesArray, query) {
            return countries.filter(function(el){
                return el.toLowerCase().indexOf(query.toLowerCase()) !== -1
            })
        }
        const resultsArray = filterCountries(countries, searchQuery);
        top5 = resultsArray.slice(0, 5);  
    };



    // renders the first (maximum of 5) results from resultsArray to the screen
    this.displayResults = function(matches){
        let self = this;
        noStroke();
        strokeWeight(0.5);

        //function which generates each result and detects user activity on the result
        const buildResultButton = function(el, i){
            let r = [width/65, height/4.5 + i*55, width/4.5, height/15]
            stroke(0)
            if (mouseX > r[0] && mouseX < r[0] + r[2] && mouseY > r[1] && mouseY < r[1] + r[3]) {
                fill(152, 255, 152);
                if (mouseIsPressed){
                    self.generateGraph(el);
                }
            } else {
                noFill();
            }
            rect(r[0], r[1], r[2], r[3], 10);
            noStroke();
            fill(0)
            text(el, width/8, height/12 + 100 + i*55)
        }

        textAlign('center');
        matches.forEach((element, index) => buildResultButton(element, index));
    };


    this.layout = {
        marginSize: marginSize,
    
        // Locations of margin positions. Left and bottom have double margin
        // size due to axis and tick labels.
        leftMargin: marginSize * 10,
        rightMargin: width - marginSize,
        topMargin: marginSize*2,
        bottomMargin: height - marginSize * 2,
        pad: 5,
    
        plotWidth: function() {
          return this.rightMargin - this.leftMargin;
        },
    
        plotHeight: function() {
          return this.bottomMargin - this.topMargin;
        },
    
        // Boolean to enable/disable background grid.
        grid: false,
    
        // Number of axis tick labels to draw so that they are not drawn on
        // top of one another.
        numXTickLabels: 10,
        numYTickLabels: 10,
    };


    this.mapYearToWidth = function(value) {
        return map(value,
                   this.startYear,
                   this.endYear,
                   this.layout.leftMargin,   // Draw left-to-right from margin.
                   this.layout.rightMargin);
    };


    this.mapUsersToHeight = function(value) {
        return map(value,
                   this.minUsers,
                   this.maxUsers,
                   this.layout.bottomMargin, // Smaller pay gap at bottom.
                   this.layout.topMargin);   // Bigger pay gap at top.
    };


    this.generateGraph = function(accessionKey) {
        let row = this.data.findRow(accessionKey, 'Country Name');
        console.log(row);
    };



    this.draw = function() {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // assign the countries variable the value of the 'Country Name' column
        countries = this.data.getColumn('Country Name');

        // Draw the title above the plot.
        this.drawTitle();
        this.createSearchBar();

        // if top5 has been assigned a value, call displayResults() and pass it in
        if (top5 !== '') { 
            this.displayResults(top5);
        }

        // Draw all y-axis labels.
        drawYAxisTickLabels(this.minUsers,
            this.maxUsers,
            this.layout,
            this.mapUsersToHeight.bind(this),
            0);

        // Draw x and y axis.
        drawAxis(this.layout);

        // Draw x and y axis labels.
        drawAxisLabels(this.xAxisLabel,
            this.yAxisLabel,
            this.layout);

        for (let i=0; i<11; i++){
            drawXAxisTickLabel(i+1 + 2010, this.layout,
                this.mapYearToWidth.bind(this));
        }

        this.destroy = function() {
            inputBox.remove();
            searchToken = true; // required to ensure the search bar will redraw if user clicks back on visual again
        }
    };
}