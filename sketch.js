let grid;
let size = 10;
let rows, cols;
let hueValue = 1;
let row;

function cellState(hueValue, velocity)
{
    this.hueValue = hueValue;
    this.velocity = velocity;
}

function setup() {
    cnv = createCanvas(windowWidth, windowHeight);
    cnv.position(0, 0);
    rows = Math.floor(width / size);
    cols = Math.floor(height / size);
    grid = make2DArray(rows, cols);
    row = rows / 2;
    for(let i = 0; i < cols; i++)
    {
        for(let j = 0; j < rows; j++)
        {
            grid[j][i] = new cellState(0,1);
        }
    }
    noStroke();
    colorMode(HSB, 360, 255, 255);
}

function draw() {
    for(let i = rows-1; i >= 0; i--)
    {
        for(let j = cols-1; j >= 0; j--)
        {
            if(grid[i][j].hueValue == 0)
            {
                fill(255);
                rect(i * size, j * size, size, size);
            }
            else if(grid[i][j].hueValue > 0 && grid[i][j].hueValue < 360)
            {
                fill(grid[i][j].hueValue, 150, 255);   
                rect(i * size, j * size, size, size);
            }
            if(grid[i][j].hueValue > 0 && grid[i][j].hueValue < 360)
            {
                let vel = grid[i][j].velocity;
                let targetCell;
                for(let k = 1; k <= Math.ceil(vel); k++)
                {
                    if(isValidRowIndex(j+k) && grid[i][j+k].hueValue == 0)
                    {
                        targetCell = grid[i][j+k];
                        grid[i][j].velocity = vel - (k - Math.ceil(vel));
                        print(vel);
                    }
                    else{
                        break;
                    }
                }
                if(targetCell != undefined)
                {
                    targetCell.hueValue = grid[i][j].hueValue + 360;
                    targetCell.velocity = grid[i][j].velocity + random(.1, .25);
                    grid[i][j].hueValue = 0;
                    grid[i][j].velocity = 1;
                }
                else
                {
                    var randomDir = Math.round(Math.random()) * 2 - 1
                    if(isValidRowIndex(i+randomDir) && isValidRowIndex(j+1) && grid[i+randomDir][j+1].hueValue == 0 && grid[i+randomDir][j].hueValue == 0)
                    {
                        grid[i+randomDir][j+1].hueValue = grid[i][j].hueValue + 360;
                        grid[i][j].hueValue = 0;
                    }
                    else if(isValidRowIndex(i-randomDir) && isValidRowIndex(j+1) && grid[i-randomDir][j+1].hueValue == 0 && grid[i-randomDir][j].hueValue == 0)
                    {
                        grid[i-randomDir][j+1].hueValue = grid[i][j].hueValue + 360;
                        grid[i][j].hueValue = 0;
                    }
                }
            }
        }
    }
    for(let i = 0; i < rows; i++)
    {
        for(let j = 0; j < cols; j++)
        {
            if(grid[i][j].hueValue > 360)
            {
                grid[i][j].hueValue -= 360;
            }
        }
    }

    //pick a random cell on row 1 and set its value to 1

    if(mouseIsPressed){
        let i = floor(mouseX / size);
        let j = floor(mouseY / size);
        if(i >= 0 && i < rows && j >= 0 && j < cols && grid[i][j].hueValue == 0)
        {
            grid[i][j].hueValue = hueValue;
        }
        hueValue += 0.1;
        if(hueValue > 360)
        {
            hueValue = 1;
        }
    }
    for(let i = 0; i < 10; i++)
    {
        row += random(-0.2, 0.24);
        if(row < 0)
        {
            row += rows;
        }
        if(row >= rows)
        {
            row -= rows
        }
        if(grid[Math.floor(row)][0].hueValue > 0)
        {
            continue;
        }
        
        grid[Math.floor(row)][0].hueValue = hueValue;
        hueValue += 0.05;
        if(hueValue > 360)
        {
            hueValue = 1;
        }
    }
}

function make2DArray(rows, cols)
{
    let arr = new Array(rows);
    for (let i = 0; i < arr.length; i++)
    {
        arr[i] = new Array(cols);
    }
    return arr;
}

function isValidRowIndex(val)
{
    return val >= 0 && val < cols;
}
function isValidRowIndex(val)
{
    return val >= 0 && val < rows;
}
