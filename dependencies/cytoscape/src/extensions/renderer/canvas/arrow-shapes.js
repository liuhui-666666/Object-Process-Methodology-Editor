var CRp = {};

var impl;

function polygon( context, points ){
  for( var i = 0; i < points.length; i++ ){
    var pt = points[ i ];

    context.lineTo( pt.x, pt.y );
  }
}

function triangleBackcurve( context, points, controlPoint ){
  var firstPt;

  for( var i = 0; i < points.length; i++ ){
    var pt = points[ i ];

    if( i === 0 ){
      firstPt = pt;
    }

    context.lineTo( pt.x, pt.y );
  }

  context.quadraticCurveTo( controlPoint.x, controlPoint.y, firstPt.x, firstPt.y );
}

function triangleTee( context, trianglePoints, teePoints ){
  if( context.beginPath ){ context.beginPath(); }
  var triPts = trianglePoints;
  for( var i = 0; i < triPts.length; i++ ){
    var pt = triPts[ i ];

    context.lineTo( pt.x, pt.y );
  }

  var teePts = teePoints;
  var firstTeePt = teePoints[0];
  context.moveTo( firstTeePt.x, firstTeePt.y );

  for( var i = 1; i < teePts.length; i++ ){
    var pt = teePts[ i ];

    context.lineTo( pt.x, pt.y );
  }

  if( context.closePath ){ context.closePath(); }
}

function circleTriangle(context, trianglePoints, rx, ry, r) {
  if (context.beginPath) { context.beginPath(); }
  context.arc(rx, ry, r, 0, Math.PI * 2, false);    
  var triPts = trianglePoints;
  var firstTrPt = triPts[0];
  context.moveTo(firstTrPt.x, firstTrPt.y);
  for (var i = 0; i < triPts.length; i++) {
    var pt = triPts[i];
    context.lineTo(pt.x, pt.y);
  }
  if (context.closePath) {
    context.closePath();
  }
}

function circle( context, rx, ry, r ){
  context.arc( rx, ry, r, 0, Math.PI * 2, false );
}

function triangleInnerCircle(context, trianglePoints, rx, ry, r) {
  var triangleUp = 0.15;

  if (context.beginPath) {
    context.beginPath();
  }
  for (var i = r; i > 0; i -= 0.01) {
    context.arc(rx, ry - 0.20, r - i, 0, Math.PI * 2, false);
  }
  context.lineTo(rx - 0.01, ry - 0.20);
  var triPts = trianglePoints;
  var firstTrPt = triPts[0];
  context.moveTo(firstTrPt.x, firstTrPt.y + triangleUp);
  for (var i = 0; i < triPts.length; i++) {
    var pt = triPts[i];
    context.lineTo(pt.x, pt.y + triangleUp);
  }
  if (context.closePath) {
    context.closePath();
  }
}

function triangleInnerTriangle(context, trianglePoints, innerTrianglePoints) {
  var triPts = trianglePoints;
  var firstTrPt = triPts[0];
  context.moveTo(firstTrPt.x, firstTrPt.y);
  for (var i = 0; i < triPts.length; i++) {
    var pt = triPts[i];
    context.lineTo(pt.x, pt.y);
  }
  
  triPts = innerTrianglePoints;
  firstTrPt = triPts[0];
  context.moveTo(firstTrPt.x + 0.023, firstTrPt.y-0.05);
  for (var i = 0; i < 0.06; i += 0.01) {
    var pt0 = triPts[0];
    var pt1 = triPts[1];
    var pt2 = triPts[2];
    context.lineTo(pt0.x, pt0.y - i);
    context.lineTo(pt1.x + i, pt1.y + i);
    context.lineTo(pt2.x - i, pt2.y + i);
  }
  context.moveTo(firstTrPt.x, firstTrPt.y);
  for (var i = 0; i < triPts.length; i++) {
    var pt = triPts[i];
    context.lineTo(pt.x, pt.y);
  }
}

function circleTee(context, trianglePoints, rx, ry, r) {
  if (context.beginPath) {
    context.beginPath();
  }

  context.arc(rx, ry, r, 0, Math.PI * 2, false);
  var triPts = trianglePoints;
  var firstTrPt = triPts[0];
  context.moveTo(firstTrPt.x, firstTrPt.y);

  for (var i = 0; i < triPts.length; i++) {
    var pt = triPts[i];
    context.lineTo(pt.x, pt.y);
  }

  if (context.closePath) {
    context.closePath();
  }
}

function veeCross(context, trianglePoints, teePoints) {
  if (context.beginPath) {
    context.beginPath();
  }

  var triPts = trianglePoints;

  for (var i = 0; i < triPts.length; i++) {
    var pt = triPts[i];
    context.lineTo(pt.x, pt.y);
  }

  var teePts = teePoints;
  var firstTeePt = teePoints[0];
  context.moveTo(firstTeePt.x, firstTeePt.y);

  for (var i = 1; i < teePts.length; i++) {
    var pt = teePts[i];
    context.lineTo(pt.x, pt.y);
  }

  if (context.closePath) {
    context.closePath();
  }
}
CRp.arrowShapeImpl = function( name ){
  return ( impl || (impl = {
    'polygon': polygon,

    'triangle-backcurve': triangleBackcurve,

    'triangle-tee': triangleTee,

    'circle-triangle' : circleTriangle,

    'triangle-cross': triangleTee,

    'circle': circle,

    'triangle-inner-circle': triangleInnerCircle,

    'triangle-inner-triangle': triangleInnerTriangle,

    'circle-tee': circleTee,

    'vee-cross': veeCross,
     
    'exctee':veeCross,
    
    'chevron-cross':veeCross,

    'vee-crossnew':veeCross

  }) )[ name ];
};

export default CRp;