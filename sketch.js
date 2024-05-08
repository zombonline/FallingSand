let grid;
let size = 5;
let rows, cols;
let hueValue = 1;
let previousMouseX = 0;
let previousMouseY = 0;

//SIM SETTINGS
let wrapAround;
let hueChangeRate = 0;

function cellState(hueValue, velocity)
{
    this.hueValue = hueValue;
    this.velocity = velocity;
}

function setup() {
    cnv = createCanvas((windowWidth/3)*2, (windowHeight/3)*2);
    cnv.parent('canvas-container');
    cnv.position((windowWidth/6), (windowHeight/6));    
    rows = Math.floor(width / size);
    cols = Math.floor(height / size);
    grid = make2DArray(rows, cols);
    //SIM SETTINGS
    setSimSettings();
    resetCells();
    noStroke();
    colorMode(HSB, 360, 255, 255);
    
}

function resetCells()
{
    for(let i = 0; i < cols; i++)
    {
        for(let j = 0; j < rows; j++)
        {
            grid[j][i] = new cellState(0,createVector(0,1));
        }
    }
}

function setSimSettings()
{
    wrapAround = select('#wrap-around-input').checked();
    hueChangeRate = select('#hue-change-rate-input').value();
    select('#wrap-around-input').changed(function(){
        wrapAround = this.checked();
    });
    select('#hue-change-rate-input').changed(function(){
        hueChangeRate = this.value();
    });
    select('#reset-button').mousePressed(resetCells);
}



function draw() {
    background(0);
    for(let i = rows-1; i >= 0; i--)
    {
        for(let j = cols-1; j >= 0; j--)
        {
            if(grid[i][j].hueValue > 0 && grid[i][j].hueValue < 360)
            {
                
                //cell state is not empty, draw a sand grain.
                fill(grid[i][j].hueValue, 150, 255);   
                rect(i * size, j * size, size, size);

                //check the velocity of the cell state
                let vel = grid[i][j].velocity;
                let targetCell;
                //loop through all cells in the direction of the velocity until a target cell is found
                //velocity has an x and y and can be negative or positive
                let maxValue = Math.max(Math.abs(vel.x), Math.abs(vel.y));
                for(let k = 1; k <= maxValue; k++)
                {
                    let newI = i + Math.ceil(vel.x * k);
                    let newJ = j + Math.ceil(vel.y * k);
                    if(wrapAround)
                    {
                        newI = getWrapAroundValue(newI, rows);
                    }
                    if(isValidColsIndex(newJ) && isValidRowIndex(newI) && grid[newI][newJ].hueValue == 0)
                    {
                        targetCell = grid[newI][newJ];
                        break;
                    }
                    else if(isValidColsIndex(-newJ) && isValidRowIndex(-newI) && grid[-newI][-newJ].hueValue == 0)
                    {
                        targetCell = grid[-newI][-newJ];
                        break;
                    }
                }
                //if a target cell under was found, prepare that cell to display sand grain next frame
                if(targetCell != undefined)
                {
                    targetCell.hueValue = grid[i][j].hueValue + 360;
                    targetCell.velocity = p5.Vector.add(grid[i][j].velocity, createVector(0,random(.1, .25)));
                    grid[i][j].hueValue = 0;
                    grid[i][j].velocity = createVector(0,1);
                }
                //if a target cell was not found, check left and right for a target cell, if one is found, prepare that cell to display sand grain next frame
                else
                {
                    grid[i][j].velocity = createVector(0,1);
                    var randomDir = Math.round(Math.random()) * 2 - 1
                    newI = i + randomDir;
                    if(wrapAround)
                    {
                        newI = getWrapAroundValue(i + randomDir, rows);
                    }
                    if(isValidRowIndex(newI) && isValidColsIndex(j+1) && grid[newI][j+1].hueValue == 0 && grid[newI][j].hueValue == 0)
                    {
                        grid[newI][j+1].hueValue = grid[i][j].hueValue + 360;
                        grid[i][j].hueValue = 0;
                    }
                    else if(isValidRowIndex(-newI) && isValidColsIndex(j+1) && grid[-newI][j+1].hueValue == 0 && grid[-newI][j].hueValue == 0)
                    {
                        grid[-newI][j+1].hueValue = grid[i][j].hueValue + 360;
                        grid[i][j].hueValue = 0;
                    }
                }
            }
        }
    }
    //look for all cells that now need to display a sand grain and update their hue value
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
    if(mouseIsPressed){
        let randomOffset = Math.round(random(-2, 2));
        let rowIndex = floor(mouseX / size) + randomOffset;
        let colIndex = floor(mouseY / size);
        if(!isValidColsIndex(colIndex) || !isValidRowIndex(rowIndex))
        {
            return;
        }
        if(previousMouseX != -1)
        {
            var mouseXChange = mouseX - previousMouseX;
            var mouseYChange = mouseY - previousMouseY;

            grid[rowIndex][colIndex].velocity = createVector(mouseXChange/10, mouseYChange/10);
        }

        if(wrapAround)
        {
            rowIndex = getWrapAroundValue(rowIndex, rows);
        }
        if(!isValidColsIndex(colIndex) || !isValidRowIndex(rowIndex))
        {
            return;
        }
        for(let i = 0; i < 1; i++)
        {
            if(grid[rowIndex][colIndex].hueValue > 0)
            {
                continue;
            }
            grid[rowIndex][colIndex].hueValue = hueValue;
            hueValue += hueChangeRate;
            if(hueValue > 360)
            {
                hueValue = 1;
            }
        }
        previousMouseX = mouseX;
        previousMouseY = mouseY;
    }
    else{
        previousMouseX = -1;
        previousMouseY = -1;
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

function getWrapAroundValue(val, max)
{
    if(val < 0)
    {
        return max - 1;
    }
    if(val >= max)
    {
        return 0;
    }
    return val;
}

function isValidColsIndex(val)
{
    return val >= 0 && val < cols;
}
function isValidRowIndex(val)
{
    return val >= 0 && val < rows;
}
