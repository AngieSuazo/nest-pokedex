import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapater';

@Module({
    providers: [AxiosAdapter],
    exports: [AxiosAdapter]
})
export class CommonModule {}
