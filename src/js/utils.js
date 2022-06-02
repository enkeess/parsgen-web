function FullObjectCopy(obj) {
  var newObj = Object.create(Object.getPrototypeOf(obj));

  return Object.assign(newObj, obj);
}

function FullArrayCopy(arr) {
  var res = [];

	arr.forEach(function(element) {

    var copyElement = FullObjectCopy(element);
    res.push(copyElement);
	});  

  return res;
}