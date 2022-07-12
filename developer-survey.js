function InteractiveBubbles() {
    this.name = 'StackOverflow Developer Survey';
    this.id = 'stackoverflow-developer-surver-2021';
    this.title = 'StackOverflow Developer Survey';
    this.loaded = false;

    

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function() {
        var self = this;
        this.data = loadTable(
            './data/developer-survey/survey_results_TEST.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function(table) {
                self.loaded = true;
            });
    }

    this.setup = function()
    {
	    createCanvas(1000, 1000);
        this.bubbles = [];
        for (var i=0; i < this.data.getRowCount(); i++) {
            var languageRow = this.data.getRow(i);
            var name = languageRow.getString("LanguageHaveWorkedWith");

            if (name != 'NA')
            {
                this.bubbles.push(new Bubble(name));
                
            }

        }
    }


    this.draw = function() 
    {
        background(100);
        push();
        textAlign(CENTER);
        translate(width/2, height/2);
        for(var i=0; i < this.bubbles.length; i++) 
        {
            this.bubbles[i].draw();
        }
        pop();
        

    }

    const Bubble = function(_name)
    {
        this.name = _name
        this.pos = createVector(0, random(-250, 250))
        this.color = color(random(0, 255), random(0, 255), random(0, 255));
        this.size = 20;
        
        this.draw = function() 
        {
            noStroke();
            fill(this.color);
            ellipse(this.pos.x, this.pos.y, 20);
            fill(0);
            text(this.name, this.pos.x, this.pos.y);

        }

        this.setValue = function(v)
        {
            this.size = v
        }
        
    }

}