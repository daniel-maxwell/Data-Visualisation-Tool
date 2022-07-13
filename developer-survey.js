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
        this.languages = [];
        this.bubbles = [];
        for (var i=0; i < this.data.getRowCount(); i++) {
            var languageRow = this.data.getRow(i);

            var name = languageRow.getString("LanguageHaveWorkedWith");

            if (name != 'NA')
            {
                var tempArray = name.split(",")
                console.log(tempArray);
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
        background(100);
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

    const Bubble = function(_name)
    {
        this.name = _name
        this.id = getRandomID();
        this.pos = createVector(0, 0);
        this.color = color(random(0, 255), random(0, 255), random(0, 255));
        this.size = 20;
        this.dir = createVector(0, 0);
       
        
        this.draw = function() 
        {
            noStroke();
            fill(this.color);
            ellipse(this.pos.x, this.pos.y, this.size);
            fill(0);
            text(this.name, this.pos.x, this.pos.y);

            this.pos.add(this.dir);

        }
        

        this.setValue = function(v)
        {
            this.size = map(v, 0, 26, 5, 200);
        }

        this.updateDirection = function(_bubbles)
        {
            this.dir = createVector(0,0);
            for (var i=0; i < _bubbles.length; i++)
            {
                if (_bubbles[i].id != this.id)
                {
                    var v = p5.Vector.sub(this.pos, _bubbles[i].pos);
                    var d = v.mag();
                    if (d < this.size/2 + _bubbles[i].size / 2)
                    {
                        if (d === 0)
                        {
                            this.dir.add(p5.Vector.random2D());
                        }
                        else
                        {
                         this.dir.add(v);
                        }
                    }
                }
            }
            this.dir.normalize();
        }
        
    }

    function getRandomID() {
        var alpha = 'abcdefghijklmnopqrstuvwxyz0123456789'
        var s = "";
        for (let i=0; i<10; i++) {
            s += alpha[floor(random(0, alpha.length))]
        }

        return s
    }

}