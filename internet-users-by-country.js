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

    this.drawTitle = function() {
        fill(0);
        noStroke();
        textAlign('center', 'center');
        textSize(25)
        text(this.title, width/2, height/40);
    }

    this.createSearchBar = function() {
        // search bar label
        textSize(16);
        text('Search for your desired country', width/8, height/8);

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
    }

    // takes the search query as an input and filters matches from the countries column
    this.searchForQuery = function(searchQuery) {
        function filterCountries(countriesArray, query) {
            return countries.filter(function(el){
                return el.toLowerCase().indexOf(query.toLowerCase()) !== -1
            })
        }
        const resultsArray = filterCountries(countries, searchQuery);
        top5 = resultsArray.slice(0, 5);  
    }


    // renders the first (maximum of 5) results from resultsArray to the screen
    this.displayResults = function(matches){
        textAlign('left');
        matches.forEach((element, index) => text(element, width/50, height/12 + 100 + index*55));
    }


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

        this.destroy = function() {
            inputBox.remove();
            searchToken = true; // required to ensure the search bar will redraw if user clicks back on visual again
        }
    }
}