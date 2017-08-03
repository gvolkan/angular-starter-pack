import { UserController } from './../controllers/user.controller';

export class ApiRoutes {

    private userController: UserController;

    constructor(private router: any) {
        this.userController = new UserController();
    }

    get routes() {

        this.router.post("/users/auth/login", this.userController.logIn);
        this.router.post("/users/auth/logout", this.userController.logOut);
        this.router.get("/users/auth/status", this.userController.status);

        return this.router;
    }

}