let o = {
  n: 101,
  explicitThis: function (m: number) {
      return m + this.n.length; // error, 'length' does not exist on 'number'
  },
};
