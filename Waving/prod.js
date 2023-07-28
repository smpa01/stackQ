const svgns = "http://www.w3.org/2000/svg";
const rectWidth = 40;
const rectHeight = 30;

const flag = [{
    "x": "af",
    "z": "https://raw.githubusercontent.com/d3/d3-logo/master/d3.svg"
}];

const svg =
    d3.select('div')
    .append('svg')
    .attr('viewBox', '0 0 1280 720')
    .attr('xmlns', svgns);


const defs = svg.append('defs').attr('id', 'pattern');

const patOne = defs
    .selectAll('pattern')
    .data(flag)
    .join('pattern')
    .attr('id', d => d.x)
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('patternContentUnits', 'objectBoundingBox')
    .append('image')
    .attr('xlink:href', d => d.z)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('width', '1')
    .attr('height', '1');


const filtData = [
    { "filtName": "feTurbulence", "numOctaves": "1", "seed": "1", 'baseFrequency': '0.006', 'stitchTiles': 'stitch', 'id': 'fltOne', 'width': `${rectWidth}`, 'height': `${rectHeight}` },
    { "filtName": "feTile", 'width': `${rectWidth*4}`, 'height': `${rectHeight+100}` },
    { "filtName": "feOffset", 'result': 'turbulence', 'dx': '0' },
    { "filtName": "feDisplacementMap", "in": "SourceGraphic", "in2": "turbulence", 'scale': `${(rectWidth/400)*30}`, 'result': 'dist', 'id': 'fltTwo' }

];

const filt = defs
    .append('filter')
    .attr('id', 'filt')
    .attr('width', '2');



filtData.forEach((filterData) => {
    const filter = filt.append(filterData.filtName);
    Object.keys(filterData).forEach((attr) => {
        if (attr !== "filtName" && attr !== "children") {
            filter.attr(attr, filterData[attr]);
        }
    });

    if (filterData.children) {
        filterData.children.forEach((childData) => {
            const childFilter = filter.append(childData.filtName);
            Object.keys(childData).forEach((attr) => {
                if (attr !== "filtName") {
                    childFilter.attr(attr, childData[attr]);
                }
            });
        });
    }
});


// Build the rectangle with the flag pattern fill
const rectMain = svg.append('rect')
    .classed('rectOne', true)
    .attr('x', '100')
    .attr('y', '100')
    .attr('width', `${rectWidth}`)
    .attr('height', `${rectHeight}`)
    .attr('fill', 'url(#af)')
    .style('filter', 'url(#filt)');

//animate    

d3.select('#filt>feOffset')
    .transition()
    .on('start', function repeat() {
        d3.active(this)
            .transition()
            .duration(2000)
            .ease(d3.easeLinear) ///must be linear ease
            .tween('x', function() {
                const interpolator = d3.interpolateNumber((rectWidth * -1), 0);
                return function(t) {
                    const val = interpolator(t);
                    d3.select(this)
                        .attr('dx', val);

                    //divTwo.text(() => scaledSinValue + interpolatedNumber);



                }


            }).on("end", repeat)
    })