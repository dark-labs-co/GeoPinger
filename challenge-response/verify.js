function verifySolution(nonce, target, solution) {
  const hash = crypto.createHash("sha256").update(solution).digest("hex");
  return hash.startsWith(target) && solution.startsWith(nonce);
}
