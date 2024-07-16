import { Observable } from 'rxjs/internal/Observable';
import { DbCleanDto } from '../dto/dbCleaner.dto';

export interface DbCleanerInterface {
  DbClean(data: unknown, metadata?: unknown): Observable<DbCleanDto>;
}
