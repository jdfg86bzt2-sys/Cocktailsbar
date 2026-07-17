"use client";

import { useState } from "react";
import Link from "next/link";
import { List, X, Bell } from "@phosphor-icons/react";
import { LogoutButton } from "./logout-button";

export function MobileMenu({
  isAdmin,
  nbEnAttente,
  userId,
  pseudo,
  nbNotifs,
}: {
  isAdmin: boolean;
  nbEnAttente: number;
  userId: string | null;
  pseudo: string | null;
  nbNotifs: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        className="flex h-9 w-9 items-center justify-center text-foreground/80"
      >
        {open ? <X size={22} weight="thin" /> : <List size={22} weight="thin" />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-16 border-b border-border bg-background px-4 py-4">
          <div className="flex flex-col gap-1 text-sm font-medium">
            <Link href="/cocktails" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-foreground/80 hover:bg-surface">Cocktails</Link>
            <Link href="/producteurs" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-foreground/80 hover:bg-surface">Producteurs</Link>

            {isAdmin && (
              <Link href="/admin" onClick={() => setOpen(false)} className="relative rounded-lg px-3 py-2.5 text-foreground/80 hover:bg-surface">
                Admin
                {nbEnAttente > 0 && <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-accent" />}
              </Link>
            )}

            {userId ? (
              <>
                <Link href="/notifications" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-foreground/80 hover:bg-surface">
                  <Bell size={18} weight="thin" />
                  Notifications
                  {nbNotifs > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent font-mono text-[10px] font-bold text-white">
                      {nbNotifs > 9 ? "9+" : nbNotifs}
                    </span>
                  )}
                </Link>
                <Link href={`/profil/${userId}`} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-foreground/80 hover:bg-surface">
                  {pseudo}
                </Link>
                <div className="px-3 py-2.5">
                  <LogoutButton />
                </div>
              </>
            ) : (
              <>
                <Link href="/connexion" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-foreground/80 hover:bg-surface">Connexion</Link>
                <Link href="/inscription" onClick={() => setOpen(false)} className="mt-1 rounded-lg bg-accent px-3 py-2.5 text-center font-medium text-accent-foreground">
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
