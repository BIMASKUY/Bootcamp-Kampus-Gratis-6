import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';

const router = Router();

interface IUser {
  name: string;
  email: string;
  phoneNumber: string;
}

router.get('/user', async (req: Request, res: Response, next: NextFunction) => {
  try{
    const user: IUser | null = await User.findOne({});
    if (!user) throw new Error('Tidak ada user sama sekali')

    res.status(200).json({
      data: user
    });
  } catch(e) {
    next(e)
  }
});

router.get('/user/:id', async (req: Request, res: Response, next: NextFunction) => {
  try{
    const user: IUser | null = await User.findById(req.params.id);
    if (!user) throw new Error('User tidak ditemukan');

    res.status(200).json({
      data: user
    });
  } catch (e) {
    next(e);
  }
});

router.get('/users/names/:name', async (req: Request, res: Response) => {
  const users: IUser[] = await User.find({
    name: req.params.name
  });
  res.status(200).json({
    data: users
  });
});


router.get('/users/emails/:email', async (req: Request, res: Response) => {
  const users: IUser[] = await User.find({
    email: req.params.email
  });
  res.status(200).json({
    data: users
  });
});

router.patch('/user/:name', async (req: Request, res: Response, next: NextFunction) => {
  try{
    if (!req.params.name) throw new Error('Masukkan nama user yang ingin diubah');
    if (!req.body.name) throw new Error('Masukan nama user terbaru');

    const user = await User.findOneAndUpdate(
      { name: req.params.name },
      { name: req.body.name },
      { new: true, runValidators: true}
    );

    if (!user) throw new Error('User tidak ditemukan');

    res.status(200).json({
      data: {
        user
      }
    });
  }
  catch (e) {
    next(e);
  }
});

router.post('/user', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phoneNumber }: IUser = req.body;
    if (!name || !email || !phoneNumber) throw new Error('Tolong lengkapi data'); 

    const user: IUser = await User.create(req.body);
    res.status(201).json({
      data: {
        user
      }
    });
  } catch (e) {
    next(e);
  }
});

export default router;