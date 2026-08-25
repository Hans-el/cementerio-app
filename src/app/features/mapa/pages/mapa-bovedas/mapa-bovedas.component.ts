import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

interface ManzanaMapa {
  sector: number;
  manzana: number;
  codigo: string;   // "01.01"
  points: string;   // "x1,y1 x2,y2 ..." listo para <polygon points>
}

@Component({
  selector: 'app-mapa-bovedas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa-bovedas.component.html',
  styleUrl: './mapa-bovedas.component.css',
})
export class MapaBovedasComponent implements OnInit, AfterViewInit {
  role: string = 'user'; // Placeholder for user role, should be set based on actual user data
  readonly urlMapa = 'https://res.cloudinary.com/dur1lhuzs/image/upload/v1785290547/mapa_vc7pie.webp';
  readonly ANCHO_IMG = 2374;
  readonly ALTO_IMG = 2760;

  manzanaActiva: ManzanaMapa | null = null;
  caminoActivo = false;
  vistaLista = false; // flag para saber si la vista ya está renderizada

  // Guarda si venimos de una localización — para hacer scroll automático
  private sectorParam: number | null = null;
  private manzanaParam: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
  ) { }

  private readonly coordsRaw: { alt: string; coords: string }[] = [
    { alt: '01.01', coords: '342,1446,337,1480,1421,1483,1419,1445' },
    { alt: '01.02', coords: '1346,1418,1426,1420,1424,1324,1346,1324' },
    { alt: '01.03', coords: '1234,1414,1322,1411,1320,1325,1243,1325' },
    { alt: '01.04', coords: '1136,1420,1213,1426,1213,1328,1131,1328' },
    { alt: '01.05', coords: '1041,1420,1104,1428,1113,1330,1039,1319' },
    { alt: '01.06', coords: '934,1422,1008,1426,1010,1300,936,1304' },
    { alt: '01.07', coords: '834,1428,909,1426,911,1307,836,1302,834,1363' },
    { alt: '01.08', coords: '756,1424,819,1416,813,1313,754,1313' },
    { alt: '01.09', coords: '653,1422,725,1422,725,1311,651,1309' },
    { alt: '01.10', coords: '576,1418,616,1418,620,1309,578,1309' },
    { alt: '01.11', coords: '477,1411,551,1416,555,1313,483,1311' },
    { alt: '01.12', coords: '381,1416,458,1420,454,1317,387,1319' },
    { alt: '01.13', coords: '316,1424,349,1424,343,1235,314,1233' },
    { alt: '01.14', coords: '1003,1273,997,1179,322,1187,318,1219,362,1225,358,1279' },
    { alt: '01.15', coords: '343,1172,311,1168,301,151,339,151' },
    { alt: '01.16', coords: '993,1166,991,1109,364,1114,368,1172' },
    { alt: '01.17', coords: '964,1091,959,1034,374,1047,374,1101' },
    { alt: '01.18', coords: '905,1017,905,979,364,982,364,1030' },
    { alt: '01.19', coords: '903,956,903,919,366,923,366,956' },
    { alt: '01.20', coords: '892,900,897,856,366,864,372,904' },
    { alt: '01.21', coords: '897,828,884,682,427,709,431,772,358,778,362,839' },
    { alt: '01.22', coords: '856,654,837,563,480,593,485,626,428,639,439,683' },
    { alt: '01.23', coords: '369,733,376,237,428,224,436,614,407,618,407,733' },
    { alt: '01.24', coords: '812,482,820,549,462,572,457,505' },
    { alt: '01.25', coords: '822,471,810,400,466,425,468,486' },
    { alt: '01.26', coords: '801,383,791,306,468,329,470,404' },
    { alt: '01.27', coords: '459,228,468,304,789,289,787,218' },
    { alt: '01.28', coords: '843,189,837,153,361,166,365,206' },
    { alt: '01.29', coords: '847,126,850,69,302,78,306,134' },
    { alt: '01.30', coords: '948,60,954,102,1422,95,1420,49' },
    { alt: '01.31', coords: '883,249,873,207,898,180,889,125,1378,119,1378,238' },
    { alt: '01.32', coords: '1382,326,850,353,841,276,1378,269' },
    { alt: '01.33', coords: '988,429,1311,416,1313,351,982,366' },
    { alt: '01.34', coords: '929,688,975,684,975,634,1095,630,1093,579,1001,573,992,460,969,456,959,372,850,391' },
    { alt: '01.35', coords: '1124,561,1017,565,1013,449,1120,447' },
    { alt: '01.36', coords: '1149,527,1317,527,1315,435,1145,443' },
    { alt: '01.37', coords: '1345,636,1391,634,1386,351,1334,353' },
    { alt: '01.38', coords: '1300,652,1307,793,1386,795,1382,652' },
    { alt: '01.39', coords: '1212,810,1279,805,1271,543,1200,548' },
    { alt: '01.40', coords: '1126,810,1194,806,1179,577,1110,575' },
    { alt: '01.41', coords: '1036,1225,1118,1216,1095,672,994,672' },
    { alt: '01.42', coords: '1143,1218,1217,1220,1202,834,1120,834' },
    { alt: '01.43', coords: '1240,1231,1307,1229,1286,822,1227,822,1242,1197' },
    { alt: '01.44', coords: '1328,1233,1380,1230,1361,813,1303,815' },
    { alt: '01.45', coords: '1464,1231,1424,1233,1420,939,1393,931,1386,845,1422,845,1403,102,1435,102' },
    { alt: '01.46', coords: '1233,1291,1229,1247,1460,1249,1460,1291' },
    { alt: '01.47', coords: '1043,1293,1210,1291,1210,1241,1043,1243' },
    { alt: '02.01', coords: '1118,2506,1133,2531,2213,1942,2198,1911' },
    { alt: '02.02', coords: '1659,2094,1697,2155,2185,1870,2150,1820' },
    { alt: '02.03', coords: '1051,2418,1087,2477,1638,2175,1609,2121' },
    { alt: '02.04', coords: '1602,1968,1640,2044,2139,1778,2091,1704' },
    { alt: '02.05', coords: '980,2310,1028,2377,1577,2092,1529,2016' },
    { alt: '02.06', coords: '1537,1853,1571,1925,2083,1667,2032,1577' },
    { alt: '02.07', coords: '1466,1899,1514,1970,936,2264,881,2192' },
    { alt: '02.08', coords: '1479,1734,1529,1814,2020,1541,1974,1451' },
    { alt: '02.09', coords: '1449,1868,858,2161,820,2096,1410,1784' },
    { alt: '02.10', coords: '1420,1615,1460,1701,1942,1434,1892,1367' },
    { alt: '02.11', coords: '759,2004,810,2069,1395,1751,1349,1677' },
    { alt: '02.12', coords: '1338,1652,1292,1568,688,1895,736,1969' },
    { alt: '02.13', coords: '1273,1550,1170,1508,623,1801,665,1876' },
    { alt: '02.14', coords: '596,1775,548,1718,915,1523,1001,1559' },
    { alt: '02.15', coords: '648,1518,696,1604,787,1569,749,1498' },
    { alt: '02.16', coords: '527,1504,604,1651,676,1611,617,1504' },
    { alt: '02.17', coords: '394,1523,508,1689,581,1657,491,1498' },
    { alt: '02.18', coords: '1300,1492,1300,1529,1395,1527,1391,1494' },
    { alt: '02.19', coords: '2269,1886,2307,1863,1946,1230,1462,1467,1489,1513,1925,1301' },
  ];
  readonly caminoCoords: [number, number][] = [
    [912, 78],
    [881, 106],
    [866, 150],
    [858, 196],
    [854, 233],
    [812, 256],
    [816, 319],
    [822, 369],
    [831, 419],
    [845, 474],
    [860, 533],
    [873, 583],
    [885, 635],
    [904, 677],
    [917, 719],
    [938, 755],
    [940, 805],
    [938, 853],
    [940, 899],
    [950, 937],
    [963, 972],
    [986, 995],
    [992, 1035],
    [1001, 1079],
    [1005, 1117],
    [1011, 1165],
    [1015, 1207],
    [1019, 1245],
    [1019, 1276],
    [1024, 1305],
    [1070, 1305],
    [1143, 1307],
    [1221, 1307],
    [1288, 1305],
    [1368, 1305],
    [1435, 1307],
    [1449, 1349],
    [1451, 1400],
    [1449, 1460],
    [1445, 1498],
    [1447, 1536],
    [1449, 1563],
    [1495, 1540],
    [1550, 1508],
    [1600, 1490],
    [1638, 1464],
    [1676, 1443],
    [1720, 1422],
    [1770, 1406],
    [1810, 1389],
    [1858, 1355],
    [1913, 1337],
    [1942, 1387],
    [1963, 1420],
    [1993, 1462],
    [2022, 1504],
    [2049, 1552],
    [2068, 1588],
    [2097, 1630],
    [2118, 1676],
    [2131, 1714],
    [2152, 1754],
    [2177, 1795],
    [2202, 1827],
    [2217, 1852],
    [2236, 1883],
    [2250, 1915],
  ];

  readonly caminoPoints = this.caminoCoords
    .map(([x, y]) => `${x},${y}`)
    .join(' ');

  manzanas: ManzanaMapa[] = this.coordsRaw.map(item => {
    const [sectorStr, manzanaStr] = item.alt.split('.');
    const nums = item.coords.split(',').map(n => parseInt(n.trim(), 10));

    const puntos: string[] = [];
    for (let i = 0; i < nums.length; i += 2) {
      puntos.push(`${nums[i]},${nums[i + 1]}`);
    }

    return {
      sector: parseInt(sectorStr, 10),
      manzana: parseInt(manzanaStr, 10),
      codigo: item.alt,
      points: puntos.join(' '),
    };
  });
  ngOnInit(): void {
    // Se ejecuta en cada navegación a /mapa, aunque el componente ya exista
    this.route.queryParams.subscribe(params => {
      if (params['sector'] && params['manzana']) {
        const sector = parseInt(params['sector'], 10);
        const manzana = parseInt(params['manzana'], 10);
        this.resaltarYScrollear(sector, manzana);
      }
    });
  }
  ngAfterViewInit(): void {
    this.vistaLista = true;
  }

  resaltarYScrollear(sector: number, manzana: number): void {
    const item = this.manzanas.find(m => m.sector === sector && m.manzana === manzana);
    if (!item) return;

    this.manzanaActiva = item;

    // Esperar a que Angular pinte el cambio de manzanaActiva en el DOM
    setTimeout(() => {
      const svgElement = this.elRef.nativeElement.querySelector(
        `polygon[data-codigo="${item.codigo}"]`
      ) as SVGPolygonElement;

      if (svgElement) {
        svgElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }
    }, 150);
  }
  seleccionarCamino(): void {
    this.manzanaActiva = null;
    this.caminoActivo = true;
  }
  seleccionarManzana(manzana: ManzanaMapa): void {
    this.manzanaActiva = manzana;
    this.caminoActivo = false;
  }

  cerrarPopup(): void {
    this.manzanaActiva = null;
    this.caminoActivo = false;

  }

  irABloques(): void {
    if (!this.manzanaActiva) return;
    this.router.navigate(['/inicio'], {
      queryParams: {
        sector: this.manzanaActiva.sector,
        manzana: this.manzanaActiva.manzana,
      },
    });
  }

  nombreSector(sector: number): string {
    return sector === 1 ? 'Cementerio Viejo' : 'Cementerio Nuevo';
  }

  isAdminOrSuperAdmin(): boolean {
    return this.role === 'admin' || this.role === 'superadmin';
  }
}