function solveChallenge(nonce, target) {
  let solution = null;
  let counter = 0;

  while (!solution) {
    const candidate = nonce + counter;
    const hash = crypto.createHash("sha256").update(candidate).digest("hex");

    if (hash.startsWith(target)) {
      solution = candidate;
    } else {
      counter++;
    }
  }

  return solution;
}
