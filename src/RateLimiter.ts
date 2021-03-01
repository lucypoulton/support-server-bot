/*
 * Copyright (C) 2021 Lucy Poulton https://lucyy.me
 * This file is part of ticketbot.
 *
 * ticketbot is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ticketbot is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ticketbot.  If not, see <http://www.gnu.org/licenses/>.
 */

export class RateLimiter {
    private readonly period: number;
    private readonly count: number;

    private rates: Map<string, number> = new Map<string, number>();

    public act(id: string): boolean {
        let rate = this.rates.get(id);
        if (rate == null) {
            this.rates.set(id, 1);
            return true;
        }
        if (rate < 0) return false;
        if (rate >= this.count) return false;
        this.rates.set(id, rate + 1);
        return true;
    }

    public shouldPrompt(id: string): boolean {
        let rate = this.rates.get(id);
        if (rate == null || rate < 0) return false;
        if (rate >= this.count) {
            this.rates.set(id, -1);
            return true;
        }
        return false;
    }

    public clear(limiter: RateLimiter) {
        limiter.rates.clear();
        setTimeout(_ => this.clear(limiter), this.period);
    }

    constructor(period: number, count: number) {
        this.period = period;
        this.count = count;
        this.clear(this);
    }
}