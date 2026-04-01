// Partner interface and mock data for FindPartner page

export interface Partner {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  phone: string;
  cashback: number;
  status: "Active" | "Inactive";
  lat: number;
  lng: number;
  partnerSince: string;
  iconType: "service" | "appliance" | "electronics" | "decor" | "furniture";
}

// Mock partner data for Cape Town area
export const PARTNERS: Partner[] = [
  {
    id: "1",
    name: "Cape Town Electronics",
    category: "Electronics",
    address: "123 Long Street",
    city: "Cape Town",
    phone: "+27 21 123 4567",
    cashback: 8,
    status: "Active",
    lat: -33.9249,
    lng: 18.4241,
    partnerSince: "2022",
    iconType: "electronics"
  },
  {
    id: "2",
    name: "Home Appliance Hub",
    category: "Appliances",
    address: "45 Kloof Street",
    city: "Cape Town",
    phone: "+27 21 234 5678",
    cashback: 10,
    status: "Active",
    lat: -33.9304,
    lng: 18.4103,
    partnerSince: "2021",
    iconType: "appliance"
  },
  {
    id: "3",
    name: "Decor Dreams",
    category: "Home Decor",
    address: "78 Bree Street",
    city: "Cape Town",
    phone: "+27 21 345 6789",
    cashback: 6,
    status: "Active",
    lat: -33.9186,
    lng: 18.4219,
    partnerSince: "2023",
    iconType: "decor"
  },
  {
    id: "4",
    name: "Furniture Factory",
    category: "Furniture",
    address: "90 Loop Street",
    city: "Cape Town",
    phone: "+27 21 456 7890",
    cashback: 12,
    status: "Active",
    lat: -33.9211,
    lng: 18.4232,
    partnerSince: "2020",
    iconType: "furniture"
  },
  {
    id: "5",
    name: "Tech Repair Services",
    category: "Service",
    address: "56 Adderley Street",
    city: "Cape Town",
    phone: "+27 21 567 8901",
    cashback: 5,
    status: "Active",
    lat: -33.9258,
    lng: 18.4232,
    partnerSince: "2023",
    iconType: "service"
  },
  {
    id: "6",
    name: "Smart Home Solutions",
    category: "Electronics",
    address: "12 Waterkant Street",
    city: "Cape Town",
    phone: "+27 21 678 9012",
    cashback: 9,
    status: "Active",
    lat: -33.9089,
    lng: 18.4175,
    partnerSince: "2022",
    iconType: "electronics"
  },
  {
    id: "7",
    name: "Kitchen Appliances Plus",
    category: "Appliances",
    address: "34 Shortmarket Street",
    city: "Cape Town",
    phone: "+27 21 789 0123",
    cashback: 11,
    status: "Active",
    lat: -33.9195,
    lng: 18.4241,
    partnerSince: "2021",
    iconType: "appliance"
  },
  {
    id: "8",
    name: "Modern Living Decor",
    category: "Home Decor",
    address: "67 Church Street",
    city: "Cape Town",
    phone: "+27 21 890 1234",
    cashback: 7,
    status: "Active",
    lat: -33.9221,
    lng: 18.4195,
    partnerSince: "2023",
    iconType: "decor"
  }
];
