export default {
  'POST  /api/demo/form': (req: any, res: any) => {
    setTimeout(() => {
      //延时
      res.send({ message: 'api/demo/form' });
    }, 1000);
  },
};
