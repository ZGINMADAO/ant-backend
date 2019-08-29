export default {
  'POST  /api/demo/one': (req: any, res: any) => {
    setTimeout(() => {
      //延时
      res.send({ message: 'api/demo/one' });
    }, 1000);
  },
};
