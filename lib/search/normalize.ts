const normalize = (input: string): string => {
  return (
    input
      .toLowerCase()
      .normalize("NFD")
      // https://stackoverflow.com/a/37511463
      .replace(/\p{Diacritic}/gu, "")
  );
};

export { normalize };
