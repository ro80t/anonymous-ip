import { BlockList, isIP } from "node:net";

function ipv4Exits(provider: string, addresses: string[], prefixLength = 32) {
  const ranges = new BlockList();
  for (const address of addresses) ranges.addSubnet(address, prefixLength);
  return { provider, ranges };
}

// Shared networks are keyed by origin ASN as well as address so reassigned routes stop matching.
const exitsByAsn = new Map([
  // RIPE assignments ProtonVPN-SE1 and ProtonVPN-IS1, verified 2026-11-27.
  // https://rdap.db.ripe.net/ip/185.159.156.0 and https://rdap.db.ripe.net/ip/185.159.158.0
  [8473, ipv4Exits("ProtonVPN", ["185.159.156.0"], 24)],
  [56704, ipv4Exits("ProtonVPN", ["185.159.158.0"], 24)],
  // NordVPN Tokyo exits observed by https://ipapi.is/vpn-exit-nodes.html on 2026-11-25/26 UTC.
  // Only these individual IPs were verified in PacketHub's assignment on AS137409.
  [137409, ipv4Exits("NordVPN", ["187.15.136.112", "187.15.136.156", "187.15.136.202"])],
  // AirVPN exit records, checked 2026-11-27. The comments identify the server names from
  // https://airvpn.org/api/status/ used to resolve <server>_exit.airservers.org.
  [
    6206,
    ipv4Exits("AirVPN", [
      "37.46.196.22", // Nembus
      "37.46.199.54", // Ashlesha
      "37.46.199.70", // Adhil
      "37.46.199.86", // Fuyue
      "45.92.16.134", // Dziban
      "94.185.80.230", // Segin
      "94.228.209.182", // Taiyangshou
      "94.228.209.214", // Vindemiatrix
      "109.235.50.19", // Dedalus
      "109.235.50.35", // Felix
    ]),
  ],
  [
    11878,
    ipv4Exits("AirVPN", [
      "68.235.35.124", // Kruger
      "68.235.38.2", // Meridiana
      "68.235.38.18", // Sadalsuud
      "68.235.48.108", // Fang
      "68.235.52.36", // Sneden
      "68.235.52.68", // Praecipua
      "173.249.217.7", // Terebellum
      "173.249.217.23", // Muliphein
      "173.249.217.38", // Unukalhai
      "198.44.129.2", // Flegetonte
      "198.44.129.242", // Revati
      "198.44.133.84", // Khambalia
      "198.44.133.101", // Guniibuu
      "198.44.133.117", // Sheratan
      "198.44.134.4", // Imai
      "198.44.136.252", // Paikauhale
      "198.44.157.34", // Kornephoros
      "198.44.157.146", // Castula
      "198.44.157.162", // Elgafar
      "198.44.157.178", // Chamukuy
      "198.44.159.34", // Sadalmelik
      "198.44.159.42", // Unurgunite
      "198.44.159.162", // Hiisi
      "198.54.128.124", // Sadachbia
      "198.54.128.138", // Torcular
      "198.54.129.44", // Xamidimura
      "198.54.129.52", // Maia
      "198.54.129.60", // Sarin
      "198.54.130.28", // Polis
      "198.54.134.252", // Bunda
      "208.77.22.212", // Superba
    ]),
  ],
  [
    32489,
    ipv4Exits("AirVPN", [
      "104.254.90.187", // Rotanev
      "104.254.90.195", // Sharatan
      "104.254.90.203", // Aludra
      "104.254.90.235", // Chort
      "104.254.90.243", // Enif
      "104.254.90.251", // Gorgonea
      "162.219.176.3", // Alhena
      "184.75.208.246", // Tegmen
      "184.75.214.163", // Cephei
      "184.75.221.3", // Lesath
      "184.75.221.35", // Regulus
      "184.75.221.43", // Sualocin
      "184.75.221.59", // Ukdah
      "184.75.221.107", // Alwaid
      "184.75.221.163", // Angetenar
      "184.75.221.171", // Alya
      "184.75.221.180", // Sadalbari
      "184.75.221.195", // Tejat
      "184.75.221.203", // Alkurhah
      "184.75.221.211", // Arkab
      "184.75.223.195", // Sargas
      "184.75.223.203", // Tyl
      "184.75.223.211", // Agena
      "184.75.223.219", // Mintaka
      "184.75.223.227", // Saiph
      "184.75.223.235", // Avior
    ]),
  ],
  [
    45179,
    ipv4Exits("AirVPN", [
      "202.50.176.8", // Theemin
      "223.165.69.72", // Tianguan
      "223.165.69.104", // Mothallah
    ]),
  ],
  [
    49453,
    ipv4Exits("AirVPN", [
      "134.19.178.167", // Piautos
      "134.19.179.131", // Piscium
      "134.19.179.139", // Capella
      "134.19.179.147", // Eltanin
      "134.19.179.155", // Scuti
      "134.19.179.163", // Melnick
      "134.19.179.171", // Aljanah
      "134.19.179.179", // Larawag
      "134.19.179.187", // Suhail
      "134.19.179.195", // Aspidiske
      "134.19.179.203", // Muhlifain
      "134.19.179.211", // Dalim
      "134.19.179.235", // Tiaki
      "134.19.179.243", // Alpheratz
      "213.152.161.5", // Alshat
      "213.152.161.10", // Atik
      "213.152.161.15", // Situla
      "213.152.161.20", // Salm
      "213.152.161.25", // Nash
      "213.152.161.30", // Merga
      "213.152.161.35", // Hyadum
      "213.152.161.40", // Hassaleh
      "213.152.161.69", // Celaeno
      "213.152.161.85", // Kajam
      "213.152.161.101", // Gianfar
      "213.152.161.118", // Alcyone
      "213.152.161.133", // Tarazed
      "213.152.161.138", // Talitha
      "213.152.161.149", // Zibal
      "213.152.161.165", // Diphda
      "213.152.161.170", // Alterf
      "213.152.161.181", // Alchiba
      "213.152.161.211", // Edasich
      "213.152.161.219", // Canis
      "213.152.161.229", // Andromeda
      "213.152.161.234", // Pyxis
      "213.152.161.240", // Orion
      "213.152.161.244", // Cygnus
      "213.152.161.249", // Musica
      "213.152.162.5", // Horologium
      "213.152.162.10", // Hydrus
      "213.152.162.15", // Crater
      "213.152.162.69", // Mirach
      "213.152.162.74", // Garnet
      "213.152.162.79", // Alrai
      "213.152.162.84", // Rukbat
      "213.152.162.89", // Miram
      "213.152.162.94", // Gienah
      "213.152.162.99", // Subra
      "213.152.162.104", // Maasym
      "213.152.162.149", // Pleione
      "213.152.162.154", // Muscida
      "213.152.162.165", // Ancha
      "213.152.162.170", // Caph
      "213.152.162.181", // Kocab
      "213.152.176.135", // Menkent
      "213.152.186.19", // Anser
      "213.152.186.24", // Jabbah
      "213.152.186.35", // Sheliak
      "213.152.186.40", // Elnath
      "213.152.186.163", // Comae
      "213.152.186.168", // Luhman
      "213.152.186.173", // Tianyi
      "213.152.187.195", // Alphecca
      "213.152.187.200", // Alphard
      "213.152.187.205", // Alzirr
      "213.152.187.210", // Asellus
      "213.152.187.215", // Alphirk
      "213.152.187.220", // Chara
      "213.152.187.225", // Matar
      "213.152.187.230", // Phaet
      "213.152.187.235", // Sadr
    ]),
  ],
  [
    51430,
    ipv4Exits("AirVPN", [
      "31.3.152.100", // Norma
      "79.142.76.244", // Copernicus
      "79.142.77.191", // Formosa
      "128.127.105.184", // Lupus
    ]),
  ],
  [
    52048,
    ipv4Exits("AirVPN", [
      "46.183.217.105", // Felis
      "84.38.135.9", // Schedir
      "109.248.148.246", // Meissa
    ]),
  ],
  [
    55720,
    ipv4Exits("AirVPN", [
      "103.230.144.104", // Sulafat
    ]),
  ],
  [
    62744,
    ipv4Exits("AirVPN", [
      "23.130.104.130", // Aquila
      "204.8.98.15", // Chamaeleon
      "204.8.98.25", // Equuleus
      "204.8.98.35", // Helvetios
      "204.8.98.45", // Leo
      "204.8.98.55", // Mensa
      "204.8.98.65", // Pegasus
      "204.8.98.75", // Ran
      "204.8.98.85", // Scutum
      "204.8.98.95", // Volans
      "204.8.98.105", // Vulpecula
    ]),
  ],
  [
    63018,
    ipv4Exits("AirVPN", [
      "64.42.179.35", // Sculptor
      "64.42.179.43", // Musca
      "64.42.179.51", // Ursa
      "64.42.179.59", // Hercules
      "64.42.179.67", // Libra
    ]),
  ],
  [
    133480,
    ipv4Exits("AirVPN", [
      "103.231.91.59", // Fawaris
    ]),
  ],
  [
    206804,
    ipv4Exits("AirVPN", [
      "37.77.56.246", // Alruba
    ]),
  ],
  [
    394256,
    ipv4Exits("AirVPN", [
      "104.193.135.243", // Ginan
      "192.30.89.27", // Pisces
      "192.30.89.51", // Telescopium
      "192.30.89.59", // Titawin
      "192.30.89.67", // Nahn
      "192.30.89.75", // Sham
    ]),
  ],
]);

/** Looks up verified VPN exits on networks that also carry ordinary traffic. */
export function getVpnExitProvider(address: string, asn: number | null): string | null {
  if (asn === null) return null;
  const exits = exitsByAsn.get(asn);
  if (!exits) return null;

  const version = isIP(address);
  if (version === 0) return null;
  // BlockList also matches IPv4 rules against their IPv4-mapped IPv6 representations.
  return exits.ranges.check(address, version === 6 ? "ipv6" : "ipv4") ? exits.provider : null;
}
