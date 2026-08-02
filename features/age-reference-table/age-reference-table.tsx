"use client";

import { useMemo, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { buildAgeTable } from "@/utils/age-table";

const currentYear = new Date().getFullYear();
const allRows = buildAgeTable(currentYear);

type EraMode = "western" | "japanese";

export function AgeReferenceTable() {
  const [era, setEra] = useState<EraMode>("western");
  const [query, setQuery] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  const filteredRows = useMemo(() => {
    const q = query.trim();
    if (!q) return allRows;
    return allRows.filter(
      (row) =>
        String(row.birthYear).includes(q) ||
        String(row.ageAfterBirthday).includes(q) ||
        String(row.ageBeforeBirthday).includes(q) ||
        row.warekiLabel.includes(q)
    );
  }, [query]);

  const shareText = `【年齢早見表】${currentYear}年基準の生まれ年・年齢一覧`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs value={era} onValueChange={(v) => v && setEra(v as EraMode)}>
          <TabsList>
            <TabsTrigger value="western">西暦</TabsTrigger>
            <TabsTrigger value="japanese">和暦</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="w-full max-w-xs space-y-1.5 sm:w-56">
          <Label htmlFor="age-table-search" className="sr-only">
            生まれ年・年齢で検索
          </Label>
          <Input
            id="age-table-search"
            type="text"
            inputMode="numeric"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="生まれ年・年齢で検索"
          />
        </div>
      </div>

      <div ref={resultRef} className="max-h-[560px] overflow-y-auto rounded-2xl border border-border">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="sticky top-0 bg-muted/90 backdrop-blur">
            <tr>
              <th className="p-3 text-left font-medium text-muted-foreground">生まれ年</th>
              <th className="p-3 text-left font-medium text-muted-foreground">満年齢（誕生日前）</th>
              <th className="p-3 text-left font-medium text-muted-foreground">満年齢（誕生日後）</th>
              <th className="p-3 text-left font-medium text-muted-foreground">数え年</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredRows.map((row) => (
              <tr key={row.birthYear}>
                <td className="p-3 font-semibold">{era === "western" ? `${row.birthYear}年` : row.warekiLabel}</td>
                <td className="p-3">{row.ageBeforeBirthday}歳</td>
                <td className="p-3">{row.ageAfterBirthday}歳</td>
                <td className="p-3">{row.kazoedoshi}歳</td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-muted-foreground">
                  該当する年・年齢が見つかりませんでした。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ResultShareActions shareText={shareText} title="年齢早見表" resultRef={resultRef} />
    </div>
  );
}
