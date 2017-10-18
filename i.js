((exports) => {
    let tau = 2 * Math.PI,
        svg = d3.select("div#i").append("svg")
                     .attr("height", 800)
                     .attr("width", 800)
                     .attr("viewBox", "-2000 -2000 4000 4000"),
        input = document.getElementById("input"),
        inputButton = document.getElementById("inputButton")

    let getIterations = () => {
        let query = location.search.slice(1)
        let num = Number.parseInt(query)
        if (Number.isNaN(num)) return 7
        return num
    }
    let interzip = (row,rowInner) => {
        let combined = Array((row.length * 2) - 2)
        let a = 0, b = 0
        for (let i = 0; i < combined.length; i++) {
            combined[i] = i % 2 ? rowInner[b++] : row[a++]
        }
        return combined
    }
    let draw = (pointArray) => {
        let poly = pointArray.map(p => { return p.join(',') }).join(' ')
        svg.append("polygon")
            .attr("points", poly)
    }
    let ngon = (radius,sides) => {
        let angles = [],
            angle = (tau - 0.000001) / sides
        for (let i = 0; i < sides; i++) angles.push(i * angle)
        return angles.map(a => {
           return [radius * Math.cos(a), radius * Math.sin(a)]
        })
    }
    let irregular = (pts) => {
        return pts.map(p => {
            let r = Math.random() + 1
            return [r * p[0], r * p[1]]
        })
    }
    let offsetMidpoint = (pt1, pt2) => {
        let mx = (pt1[0] + pt2[0]) / 2,
            my = (pt1[1] + pt2[1]) / 2,
            vx = -(pt1[1] - pt2[1]),
            vy = pt1[0] - pt2[0],
            d = Math.random() - 0.5
        return [mx + d * vx, my + d * vy]
    }
    let loopAround = (pts) => {
        return pts.concat([pts[0]])
    }
    let subdivideWith = (f, pts) => {
        let newPoints = []
        pts = loopAround(pts)
        for (let i = 0; i < pts.length - 1; i++) {
            newPoints.push(f(pts[i],pts[i+1]))
        }
        return interzip(pts,newPoints)
    }
    var p = irregular(ngon(700,3))
    var island = subdivideWith(offsetMidpoint,p)
    for (var i = 0; i < getIterations(); i++)
        island = subdivideWith(offsetMidpoint,island)
    draw(island)

    inputButton.onclick = () => {
        location.href = 'https:\\\\' + location.host + '/?' + input.value
    }
})(window);
