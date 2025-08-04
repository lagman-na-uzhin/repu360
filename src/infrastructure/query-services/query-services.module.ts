import {Module} from "@nestjs/common";
import {QUERY_SERVICES} from "@infrastructure/query-services/index";

@Module({
    imports: [],
    providers: [
        ...QUERY_SERVICES,
    ],
    exports: [...QUERY_SERVICES],
})
export class QueryServicesModule {}
