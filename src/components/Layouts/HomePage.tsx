import React, { useMemo, useState } from "react";
import type { SearchState } from "../../types/types";
import { cities, sampleHotels } from "../../services/data";
import { SpringBackdrop } from "../HomeLayout/SpringBackdrop";
import { HomeHeader } from "../Header/HomeHeader";
import { HomeHero } from "../HomeLayout/HomeHero";
import { HomeDeals } from "../HomeLayout/HomeDeals";
import { HomePopular } from "../HomeLayout/HomePopular";
import { HomeWhy } from "../HomeLayout/HomeWhy";
import { HomeFooter } from "../Footer/HomeFooter";
import { HomeBanner } from "../HomeLayout/HomeBanner";
import { HomeQuickFilters } from "../HomeLayout/HomeQuickFilters";
import { HomeTestimonials } from "../HomeLayout/HomeTestimonials";

export default function HomePage() {
    const [search, setSearch] = useState<SearchState>({
        city: "danang",
        keyword: "",
        guests: 2,
        range: null,
    });

    const hotelsFiltered = useMemo(() => {
        const key = search.keyword.trim().toLowerCase();
        return sampleHotels
            .filter((h) => (search.city ? h.city === search.city : true))
            .filter((h) => (key ? h.name.toLowerCase().includes(key) : true));
    }, [search.city, search.keyword]);
    const [quick, setQuick] = useState({ tags: [], priceBand: undefined, ratingMin: undefined });


    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white text-slate-900">
            <SpringBackdrop />
            <HomeHeader />

            <main>
                <HomeHero
                    cities={cities}
                    value={search}
                    onChange={(patch) => setSearch((s) => ({ ...s, ...patch }))}
                    onSearch={() => {
                        console.log("SEARCH:", search);
                    }}
                />
                <HomeBanner />
                <HomeQuickFilters value={quick} onChange={(p) => setQuick((s) => ({ ...s, ...p }))} />
                <HomeDeals />
                <HomePopular hotels={hotelsFiltered} cities={cities} />
                <HomeTestimonials />
                <HomeWhy />
            </main>

            <HomeFooter />
        </div>
    );
}
