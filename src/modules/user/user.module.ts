import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { ViajeModule } from '../viaje/viaje.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    forwardRef(() => ViajeModule),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, MongooseModule],
})
export class UserModule {}