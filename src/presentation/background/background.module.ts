import { Module } from '@nestjs/common';
import { UsecaseProxyModule } from 'src/infrastructure/usecase-proxy/usecase-proxy.module';

const IMPORT_PROVIDERS_BY_TYPE_ENV = () => {
    const schedules: any = [];
    const processes: any = [];
    return [...processes, ...schedules];
};
@Module({
    imports: [UsecaseProxyModule.register()],
    providers: [...IMPORT_PROVIDERS_BY_TYPE_ENV()],
})
export class BackgroundModule {}
