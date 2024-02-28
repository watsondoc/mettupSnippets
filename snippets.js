// Defining routes for an Express.js application using a route grouping

// app.js
const app = express();
app.use('/api/v1/internal/', internal);
app.use('/api/v1/auth/', auth);

app.use('/api/v1/route1/', route1);
app.use('/api/v1/routeN/', routeN);

// endpoints.js
module.exports = {
  internal: routeGroup((bind) => {
    bind('/orders', 'OrdersController');
    bind('/users', 'UsersController');
    // more rotes here
  }),

  // More groups
};


//------------------------------------------------

function routeGroup(func) {
  // 'express-promise-router'
  const controller = new PromiseBasedController();
  const router = controller.getRouter();

  function bind(routePath, file) {
    const Controller = require(`/path/to/controllers/${file}`);
    const controller = new Controller();
    router.use(routePath, controller.getRouter());
  }

  func(bind);
  return router;
}

//OrdersController.js
class OrdersController extends BaseApiController {
  constructor() {
    super(Service, Mapper);
    const router = this.getRouter();

    router.get('/', this.getOrders.bind(this));
    router.post('/', this.createOrder.bind(this));
  }
}

//------------------------------------------------


// app.js
mountActionBasedEndpoints(app, '/api/v1/route',
  path.join(__serverDirname, './actions/api'));

function mountActionBasedEndpoints(app, apiPath, folderPath) {
  app.use(apiPath, actionsLoader.loadActions(apiPath, folderPath));
}

//------------------------------------------------


// actions.js
function loadActions(apiPath: string, actionsFolder: string) {
  const router = createRouter();
  const ext = isProduction ? 'js' : '{js,ts}';
  const files = glob.sync(`${actionsFolder}/**/*Action.${ext}`);

  for (const file of files) {
    const Action = require(file);

    if (!Action.route) {
      continue;
    }

    const middleware = async (req: Request, res: Response) => {
      const actionInstance = new Action(req);
      const result = await actionInstance.execute();
      return binaryDataResponder.response(res, result.data);
    }

    router[Action.verb](Action.route, middleware);
  }

  return router;
}



//------------------------------------------------


// ordersAction.js/ts
@CreateOrderAction.Route({
  verb: CreateOrderAction.HttpVerb.POST,
  path: '/orders',
  permissions: ['CREATE', 'MANAGE'],
})
class CreateOrderAction extends BaseAction {
  static get bodyValidationSchema() {}
  constructor(options: Options) {}
  async preAction() {}
  async doAction() {}
  async postAction() {}
  async getResult() {}
}

//------------------------------------------------

function async execute() {
  await this.preAction();
  const result = await this.doAction();
  await this.postAction(result);
  return this.getResult(result);
}

//------------------------------------------------

// nest.controller.ts
@Controller()
class Controller {
  @Get('orders/:id')
  async search(
    @Param('id') id: string,
    @Body() options: Options,
  ): Promise<any> {
    // any logic here
  }
}

// controller.module.ts
@Module({
  controllers: [
    Controller,
  ],
})


//------------------------------------------------



// AJV validation
function bodyValidationSchema() {
  return {
    type: 'object',
    required: ['orderId', 'orderName'],
    properties: {
      orderId: PropertyType.STRING_NOT_EMPTY,
      orderName: PropertyType.STRING_REQUIRED,
      description: PropertyType.STRING_LIMITED,
      tags: PropertyType.ARRAY_REQUIRED_WITH(
        PropertyType.STRING_NOT_EMPTY
      ),
    },
  };
}


//------------------------------------------------

// NestJs Dto model
class OrderDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  orderId: number;

  @ApiProperty()
  @IsString()
  orderName: string;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  tags: string[];
}

//------------------------------------------------


// moduleA.js
const moduleC = require('./moduleC');
const moduleD = require('./moduleD');

module.exports = {
  a: 'Hello from moduleA',
  c: moduleC(),
  d: moduleD()
};
// moduleC.js
module.exports = () => {
  return 'Hello from moduleC';
};
// moduleD.js
const moduleA = require('./moduleA');

module.exports = () => {
  return moduleA;
};
// index.js
const moduleA = require('./moduleA');

// У нас есть модуль moduleA, который импортирует moduleC и moduleD
// Однако moduleD импортирует обратно moduleA, создавая циклическую зависимость
// В этом случае при запуске программы вы получите пустой объект


//------------------------------------------------


private get circularDependencyService() {
  return (
    require('path-to-service')
  );
}

//------------------------------------------------

const mockService = proxyquire('path-to-service/Service', {
  'path-to-module/CacheService': new FakeCacheService(),
  'path-to-module/AnyService': new FakeAnyService(),
});

const myService = new MyService();
spyOn(myService, 'getValue').and.returnValue(100);

//------------------------------------------------

let orderService;

beforeEach(async () => {
  const orderRepositoryMock = {
    findOne: jest.fn().mockResolvedValue({ id: 1, name: 'order1' }),
  };

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      OrderService,
      {
        provide: OrderRepository,
        useValue: orderRepositoryMock,
      },
    ],
  }).compile();

  orderService = module.get<OrderService>(OrderService);
});


//------------------------------------------------

// NOTE: Nest.JS ---> Express.JS injection approach
function onModuleInit() {
  const getNestjsAppServiceBy = (injectionToken: string | symbol) => {
    const injectionValue = this.moduleRef.get(injectionToken, { strict: false });
    return injectionValue;
  };

  // We add the util method to the 'global' in order to retrieve Nest.JS services in Express.JS code in runtime
  Object.assign(global, {
    getNestjsAppServiceBy,
  });
}

async function mountSubApp(app, mountPath, bootstrapSubApp) {
  const subApp = await bootstrapSubApp();
  await subApp.init();

  //  underlying HTTP adapter
  const subAppExpressInstance = subApp.getHttpAdapter().getInstance();
  app.use(mountPath, subAppExpressInstance);
  return app;
}

export async function createNestApp(): Promise<INestApplication> {
  const app = await NestFactory.create<NestExpressApplication>(MainModule, {
    logger: new InternalNestAppLoggerProxy(),
  });

  return app;
}
