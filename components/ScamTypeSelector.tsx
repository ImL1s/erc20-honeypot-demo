"use client";

import Image from "next/image";
import { type ScamType, SCAM_CONTRACTS } from "../lib/contract";
import { useLocale } from "./LocaleProvider";

interface ScamTypeSelectorProps {
    selected: ScamType;
    onChange: (type: ScamType) => void;
}

const SCAM_TYPES: ScamType[] = ["honeypot", "hiddenFee", "tradingSwitch", "maxTx", "cooldown"];

export function ScamTypeSelector({ selected, onChange }: ScamTypeSelectorProps) {
    const { t } = useLocale();

    return (
        <div className="w-full">
            {/* Desktop: Horizontal tabs with improved design */}
            <div className="hidden md:flex gap-2 p-2 glass rounded-2xl shadow-lg">
                {SCAM_TYPES.map((type) => {
                    const config = SCAM_CONTRACTS[type];
                    const isSelected = selected === type;
                    const label = t(`scamTypes.${type}.short`) as string;

                    return (
                        <button
                            key={type}
                            onClick={() => onChange(type)}
                            className={`
                flex-1 flex items-center justify-center gap-3 px-5 py-4 rounded-xl
                font-semibold text-sm transition-all duration-300 hover-lift
                ${isSelected
                                    ? "bg-gradient-to-br from-ink to-slate-800 text-white shadow-xl ring-2 ring-mint/30"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                                }
              `}
                        >
                            <span className={`text-2xl ${isSelected ? 'animate-float' : ''}`}>{config.icon}</span>
                            <span className="hidden lg:inline">{label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Mobile: Horizontal scroll cards */}
            <div className="md:hidden overflow-x-auto pb-2 -mx-2 px-2">
                <div className="flex gap-3 min-w-max">
                    {SCAM_TYPES.map((type) => {
                        const config = SCAM_CONTRACTS[type];
                        const isSelected = selected === type;
                        const label = t(`scamTypes.${type}.short`) as string;

                        return (
                            <button
                                key={type}
                                onClick={() => onChange(type)}
                                className={`
                  flex flex-col items-center gap-2 px-5 py-3 rounded-xl
                  font-semibold text-xs transition-all duration-300
                  min-w-[80px]
                  ${isSelected
                                        ? "bg-gradient-to-br from-ink to-slate-800 text-white shadow-xl scale-105"
                                        : "bg-white/60 text-slate-600 hover:bg-white/80 shadow-md"
                                    }
                `}
                            >
                                <span className="text-2xl">{config.icon}</span>
                                <span className="whitespace-nowrap">{label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selected type info card - Enhanced design */}
            <div className="mt-5 p-5 glass rounded-2xl shadow-xl hover-lift">
                <div className="flex gap-5">
                    {/* Illustration - Larger */}
                    <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-ink to-slate-800 shadow-2xl ring-2 ring-mint/20">
                        <Image
                            src={SCAM_CONTRACTS[selected].image}
                            alt={t(`scamTypes.${selected}.name`) as string}
                            width={160}
                            height={160}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl animate-float">{SCAM_CONTRACTS[selected].icon}</span>
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 truncate">
                                {t(`scamTypes.${selected}.name`) as string}
                            </h3>
                        </div>
                        <p className="mt-2 text-sm md:text-base text-slate-600 line-clamp-3">
                            {t(`scamTypes.${selected}.description`) as string}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="badge-danger px-3 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-full">
                                ⚠️ {t(`scamTypes.${selected}.tag`) as string}
                            </span>
                            <span className="px-3 py-1 text-xs font-mono bg-slate-100 text-slate-600 rounded-full">
                                ${SCAM_CONTRACTS[selected].symbol}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
