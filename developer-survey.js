function InteractiveBubbles() {
    this.name = 'StackOverflow Developer Survey';
    this.id = 'stackoverflow-developer-surver-2021';
    this.title = 'StackOverflow Developer Survey';
    this.loaded = false;
    this.bubblecoordinates = {'HTML/CSS': [0, 0], 'Python': [0,0], 'JavaScript': [0,0], 'Go': [0,0], 'Java': [0,0], 'C': [0,0], 'C++': [0,0], 'C#': [0,0], 'R': [0,0], 'Ruby': [0,0], 'Kotlin': [0,0], 'Swift': [0,0], 'TypeScript': [0,0]};

    

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
	    resizeCanvas(1000, 1000, true);
        this.languages = [];
        this.bubbles = [];
        for (var i=0; i < this.data.getRowCount(); i++) {
            var languageRow = this.data.getRow(i);

            var name = languageRow.getString("LanguageHaveWorkedWith");

            if (name != 'NA')
            {
                var tempArray = name.split(",")
                tempArray.forEach(el => this.languages.push(el));
            }

        }
        let languageResults = {'HTML/CSS': 0, 'Python': 0, 'JavaScript': 0, 'Go': 0, 'Java': 0, 'C': 0, 'C++': 0, 'C#': 0, 'R': 0, 'Ruby': 0, 'Kotlin': 0, 'Swift': 0, 'TypeScript': 0}

        for (let i=0; i < this.languages.length; i++)
        {
            if (languageResults[this.languages[i]] != undefined)
            {
                languageResults[this.languages[i]] += 1
            }
        }

        console.log(languageResults)

        // creates bubbles based on the selection of languages in languageResults
        for (const [key, value] of Object.entries(languageResults)) {
            var b = new Bubble(key);
            var v = value
            b.setValue(v)
            this.bubbles.push(b);
        }
    }


    this.draw = function() 
    {
        background(255);
        push();
        textAlign(CENTER);
        translate(width/2, height/2);
        for(var i=0; i < this.bubbles.length; i++) 
        {
            this.bubbles[i].updateDirection(this.bubbles);
            this.bubbles[i].draw();
        }
        pop();
        
    }

    // Bubble constructor
    const Bubble = function(_name)
    {
        this.name = _name
        this.id = getRandomID();
        this.pos = createVector(0, 0);
        this.color = color(random(0, 255), random(0, 255), random(0, 255));
        this.size = 20;
        this.dir = createVector(0, 0);
        this.expanded = 0
        
        this.draw = function() 
        {
            noStroke();
            fill(this.color);
            ellipse(this.pos.x, this.pos.y, this.size);
            fill(0);
            text(this.name, this.pos.x, this.pos.y);
            // displace the bubble based on how much it overlaps with other bubbles
            this.pos.add(this.dir);

            if (this.withinBubble(mouseX, mouseY, this.pos.x + width/2, this.pos.y + height/2, this.size/2) && this.expanded == 0)
            {
                while (this.expanded < 100) {
                    for (let i=0; i<100; i++) {
                        this.size = this.size += (i/500)
                        this.expanded += 1
                    };
                }
            }
            
            else if (this.withinBubble(mouseX, mouseY, this.pos.x + width/2, this.pos.y + height/2, this.size/2) === false && this.expanded > 98)
            {
                while (this.expanded > 0) {
                    for (let i=0; i<100; i++) {
                        this.size = this.size -= (i/500)
                        this.expanded -= 1
                    }
                }
            }
        }


        // test if a the distance between the mouse cursor and the center of a bubble is smaller than its raidus
        this.withinBubble = function(x, y, cx, cy, radius) {
            var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
            return distancesquared <= radius * radius;
        }

        this.setValue = function(v)
        {
            this.size = map(v, 0, 26, 50, 275);
        }

        // if bubbles overlap, changes the location of the bubble by a random 2D vector
        this.updateDirection = function(_bubbles)
        {
            this.dir = createVector(0,0);

            for (var i=0; i < _bubbles.length; i++) {
                if (_bubbles[i].id != this.id) {
                    var v = p5.Vector.sub(this.pos, _bubbles[i].pos);
                    var d = v.mag();
                    if (d < this.size/2 + _bubbles[i].size / 2) {
                        if (d === 0) {
                            this.dir.add(p5.Vector.random2D());
                        }
                        else {
                         this.dir.add(v);
                        }
                    }
                }
            }
            this.dir.normalize();
        }
    }


    // Generates a random ID based on a string of the alphanumeric characters
    function getRandomID() {
        var alpha = 'abcdefghijklmnopqrstuvwxyz0123456789'
        var s = "";
        for (let i=0; i<10; i++) {
            s += alpha[floor(random(0, alpha.length))]
        }
        return s
    }

    this.destroy = function() {
        resizeCanvas(1024, 576);
    }

}
