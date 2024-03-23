import { defineStore } from "pinia";
import SaleInterface from "../interface/sale.interface.ts";
import { format } from "@formkit/tempo";

const useFunctionsStore = defineStore("functions", () => {
  const formatNumber = (num: string) => {
    let parts = num.split(".");

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return parts.join(",");
  };
  const printSale = ({
    enterprise,
    client,
    products,
    totalAmount,
    createdAt,
    id,
    type,
  }: SaleInterface) => {
    const frame = window.open("", "_blank");
    if (frame) {
      frame.document.body.innerHTML = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factura de Venta</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            max-width: 500px;
        }
        .header, .section {
            margin-bottom: 20px;
        }
        .header h1, .section h2 {
            margin: 0;
            padding: 10px 0;
            border-bottom: 1px solid #ddd;
        }
        .details {
            display: grid;
            grid-template-columns: 1fr 1fr; /* Dos columnas de igual ancho */
            gap: 10px;
        }
        .details div {
            padding: 5px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        .total {
            text-align: right;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Factura de Venta - ${type === 0 ? "Contado" : "Crédito"}</h1>
        <p>id: ${id.split("-").join("")}</p>
        <div>Fecha de creación: ${format({
          date: `${createdAt}`,
          format: "YYYY-MM-D hh:mm a",
        })}
        </div>
        <div>${enterprise.name}</div>
            <div>${enterprise.address}</div>
    </div>

    ${
      client
        ? `
    <div class="section">
        <h2>Cliente</h2>
        <div class="details">
            <div>${client.names} ${client.surnames}</div>
            <div>${client.documentNumber}</div>
            <div>${client.email}</div>
            <div>${client.phone}</div>
        </div>
    </div>
    `
        : ""
    }

    <div class="section">
        <h2>Venta</h2>
        <table>
            <tr>
                <th>Producto</th>
                <th>Precio Unitario</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
            </tr>
            ${products
              .map(
                (product) => `
            <tr>
                <td>${product.name}</td>
                <td>$${formatNumber(product.salePrice)}</td>
                <td>${product.quantity}</td>
                <td>$${formatNumber(`${product.subtotal}`)}</td>
            </tr>
            `,
              )
              .join("")}
        </table>
    </div>
    <div class="total">
        <strong>Total: $${formatNumber(`${totalAmount}`)}</strong>
    </div>
</body>
</html>
      `;
    }
  };

  return { printSale };
});

export default useFunctionsStore;
