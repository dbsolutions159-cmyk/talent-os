function analyzeFace(data) {

  let trust = 100;
  let flags = [];

  if (data.faceMissing > 2) {
    trust -= 30;
    flags.push("Face Missing");
  }

  if (data.multipleFaces > 0) {
    trust -= 50;
    flags.push("Multiple Faces");
  }

  return { trust, flags };
}

module.exports = { analyzeFace };