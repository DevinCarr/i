((exports) => {
    let tau = 2 * Math.PI,
        svg = d3.select("div#i").append("svg")
                     .attr("height", 400)
                     .attr("width", 400)
                     .attr("viewBox", "-500 -500 1000 1000")

    let zip = (rowLeft,rowRight,f) => rowLeft.map((i,c) => f(i,rowRight[c]))
    let zipPoints = (rowLeft,rowRight,f) => zip(rowLeft,rowRight,(l,r) => zip(l,r,f))
    let draw = (pointArray) => {
        let poly = pointArray.map(p => { return p.join(',') }).join(' ')
        console.log(poly)
        svg.append("polygon")
            .attr("points", poly)
    }
    let ngon = (radius,sides) => {
        let angles = [],
            angle = (tau - 0.000001) / sides
        for (var i = 0; i < sides; i++) angles.push(i * angle)
        return angles.map(a => {
           return [radius * Math.cos(a), radius * Math.sin(a)]
        })
    }
    let irregular = (pts) => {
        return pts.map(p => {
            var r = Math.random()
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
        return pts.concat([pts[0]]);
    }
    let subdivideWith = (f, pts) => {
        if (pts.length === 1) return [pts[0]]
        return [pts[0],f(pts[0],pts[1])]
                .concat(subdivideWith(f,pts.slice(1)))
    }
    var p = loopAround(irregular(ngon(700,3)))
    var island = subdivideWith(offsetMidpoint,p)
    for (var i = 0; i < 5; i++)
        island = subdivideWith(offsetMidpoint,island)
    draw(island)
})(window);
