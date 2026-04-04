import type { TrendItem } from "@core/ports/repositories/tag.repository";

export interface GetTrendsOutput {
    trends: TrendItem[];
}
