module.exports = threads => {
  const active = [];
  const archive = [];

  threads.forEach(thread => (thread.status === 255 ? archive : active).push(thread));

  return { active, archive };
};
