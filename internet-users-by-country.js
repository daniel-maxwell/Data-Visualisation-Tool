function SearchBar() {
    this.name = 'Internet users by country (as a % of population)';
    this.id = 'world-internet-users-2010-2020';
    this.title = 'Percentage of population using the internet, by country (2010-2020)';
    this.loaded = false;
    let inputBox;
    let searchToken = true;
    let queryLength;

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
            }
        );
    }

    this.drawTitle = function() {
        fill(0);
        noStroke();
        textAlign('center', 'center');
        textSize(32)
        text(this.title, width/2, height/10);
    }

    this.createSearchBar = function() {
        // render the search bar to the screen
        if (searchToken == true) {
            inputBox = createInput('');
            inputBox.position(width/2, height/2);
            inputBox.size(500);
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

    this.searchForQuery = function(searchQuery) {
        console.log('you searched for: ' + searchQuery);
        let searchResults = {};
        for (let i=0; i<11; i++) {

            searchResults[i] = `${i}`
            createButton(`${i}`).position(width/2, height/2 + 100 + i * 100);
            
        }
    
    }


    this.draw = function() {
    if (!this.loaded) {
        console.log('Data not yet loaded');
        return;
    }

    // Draw the title above the plot.
    this.drawTitle();
    this.createSearchBar();

    }

    this.destroy = function() {
        inputBox.remove();
        searchToken = true; // required to ensure the search bar will redraw if user clicks back on visual again
    }
}