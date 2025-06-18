"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer';
import Chart from 'chart.js/auto';

const EL = () => {
  const [energyData, setEnergyData] = useState(null);
  const [elUsed, setElUsed] = useState('no');
  const [electricityBill, setElectricityBill] = useState('');
  const [area, setArea] = useState(0);
  const [w_s, setWs] = useState(0); // Wind Speed
  const [geometry, setGeometry] = useState(null); // Store geometry here
  const [adjustedE, setAdjustedE] = useState(''); // Start with an empty string
  const [pEl, setPEl] = useState(''); // Start with an empty string
  const [Production_ELRaw, setProduction_ELRaw] = useState(0); // Store raw wind power
  const [pElRaw, setPElRaw] = useState(0); // Store raw production EL
  const [ghi, setGhi] = useState(0);
  const [bni, setBni] = useState(0);
  const [TEMP, setTemp] = useState(0);
  const [DHI, setDhi] = useState(0);
  const [chartImage, setChartImage] = useState(null);

  const router = useRouter();
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('energyData'));
    if (data && data.geometry) {
      setEnergyData(data);
      setArea((data.shape_area * 1000).toFixed(2)); // Transform to m² and format
      setWs(data.w_s.toFixed(2)); // Wind Speed from energyData and format
      setGhi(data.ghi.toFixed(2));
      setBni(data.bni.toFixed(2));
      setDhi(data.DHI.toFixed(2));
      setTemp(data.TEMP.toFixed(2));
      setGeometry(data.geometry); // Set geometry from localStorage
      generateChartImage(data.chartData);
    } else {
      console.error('No geometry data found in localStorage');
    }
  }, []);

  const generateChartImage = (chartData) => {
    const canvas = chartRef.current;
    if (!canvas) {
      console.error('Canvas element is missing');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas 2D context');
      return;
    }

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy(); 
    }

    const chart = new Chart(ctx, {
      ...chartData,
      options: {
        ...chartData.options,
        animation: {
          onComplete: () => {
            const chartDataURL = chart.toBase64Image();
            setChartImage(chartDataURL); 
          }
        }
      }
    });
    
    chartInstanceRef.current = chart;
  };

  const formatValueWithUnit = (value) => {
    if (value >= 1e9) {
      return (value / 1e9).toFixed(2) + ' GWh';
    } else if (value >= 1e6) {
      return (value / 1e6).toFixed(2) + ' MWh';
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(2) + ' kWh';
    } else {
      return value.toFixed(2) + ' Wh';
    }
  };

  const handleCalculate = () => {
    if (energyData && geometry) {
      const rho = 1.225; // Air density at sea level and 15°C in kg/m³
      const cp = 0.4; // Power coefficient (efficiency factor)
      const areaSwept = Math.PI * Math.pow((area / Math.PI), 2); // Swept area calculation

      const Production_EL = (0.5 * rho * areaSwept * Math.pow(w_s, 3) * cp); // Wind power calculation
      const puissance_EL = (Production_EL * 0.3); // Assume 30% of theoretical power as production

      setProduction_ELRaw(Production_EL); // Store raw wind power
      setPElRaw(puissance_EL); // Store raw production EL

      setAdjustedE(formatValueWithUnit(Production_EL)); // Update state with formatted wind power
      setPEl(formatValueWithUnit(puissance_EL)); // Update state with formatted production
    } else {
      console.error('Energy data or geometry is missing');
    }
  };

  const handleGeneratePdf = async () => {
    if (energyData && geometry) {
      const expEl = elUsed === 'yes' ? 1 : 0;

      const electricityBillValue = parseFloat(electricityBill);
      if (isNaN(electricityBillValue)) {
        alert('Please enter a valid electricity bill value.');
        return;
      }

      const dataToSave = {
        w_s,
        area,
        geom: geometry, // Use the geometry stored in state
        exp_el: expEl,
        f_e: electricityBillValue,
        el: Production_ELRaw, // Send raw wind power
        p_el: pElRaw, // Send raw production EL
      };

      try {
        const response = await fetch('http://127.0.0.1:8000/map/save_el_data/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
          },
          body: JSON.stringify(dataToSave),
        });

        const result = await response.json();

        if (result.error) {
          alert(`Error: ${result.error}`);
        } else {
          const blob = await pdf(ReportDocument(adjustedE, pEl)).toBlob();
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'EL_Energy_Calculation_Report.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while saving data.');
      }
    } else {
      alert('Energy data or geometry is missing');
    }
  };

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const styles = StyleSheet.create({
    page: {
      padding: 20,
      fontFamily: 'Helvetica',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 20,
      borderBottom: '2px solid #002060',
    },
    logo: {
      width: 100,
      height: 50,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#002060',
      textAlign: 'center',
      marginVertical: 10,
    },
    infoSection: {
      marginVertical: 20,
      padding: 15,
      backgroundColor: '#f2f2f2',
      borderRadius: 8,
      borderLeft: '6px solid #002060',
      borderBottom: '1px solid #ddd',
    },
    infoText: {
      fontSize: 12,
      marginBottom: 10,
      color: '#333',
    },
    resultSection: {
      marginTop: 20,
    },
    resultRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    resultText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#002060',
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    resultValue: {
      fontSize: 12,
      color: '#333',
      marginLeft: 5, // Space between value and unit
    },
    footer: {
      marginTop: 30,
      textAlign: 'center',
      fontSize: 10,
      color: 'grey',
    },
    image: {
      width: 50,
      height: 50,
    },
    chartContainer: {
      marginTop: 20,
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex', //
    },
    chartImage: {
      width: '70%',
      height: 'auto',
      marginVertical: 15,
    },
    pageNumber: {
      position: 'absolute',
      fontSize: 12,
      bottom: 50,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'grey',
    },
    page: {
      padding: 30,
    },
    section: {
      marginBottom: 20,
    },
  });

  const logoURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX80vkN7Ot4BIP-hmTfr73VH6jyQ0PqkGF-efZ3u_hYJWjBjZJM1mk3D88FQQ_V5FfmQ&usqp=CAU";
  const iresenURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ4kObrMBZmKbbB-zNDLyiPvNsJp7EGJPB3Q&s";

  const ReportDocument = (adjustedE, pEl) => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src={logoURL} />
          <Text style={styles.title}>Rapport De Potentiel Éolien</Text>
          <Image style={styles.logo} src={iresenURL} />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>GLOBAL HORIZONTAL IRRADIANCE: {ghi} kWh/m²</Text>
          <Text style={styles.infoText}>BEAM NORMAL IRRADIANCE: {bni} kWh/m²</Text>
          <Text style={styles.infoText}>DIRECT HORIZONTAL IRRADIANCE: {DHI} kWh/m²</Text>
          <Text style={styles.infoText}>TEMPERATURE: {TEMP} °C</Text>
          <Text style={styles.infoText}>SURFACE: {area} km²</Text>
        </View>

        <View style={styles.resultSection}>
          <View style={styles.resultRow}>
            <Text style={styles.resultText}>PRODUCTION ÉOLIENNE ESTIMÉE:</Text>
            <Text style={styles.resultValue}>{adjustedE}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultText}>PUISSANCE ÉOLIENNE ESTIMÉE:</Text>
            <Text style={styles.resultValue}>{pEl}</Text>
          </View>
        </View>

        {chartImage && (
          <View style={styles.chartContainer}>
            <Image style={styles.chartImage} src={chartImage} />
          </View>
        )}

        <Text style={styles.footer}>
          Remarque: Ce rapport est généré sur la base des données disponibles et doit être considéré comme une estimation préliminaire. Pour des résultats plus précis, veuillez consulter un spécialiste de l’énergie éolienne.
        </Text>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url("https://images.pexels.com/photos/2735865/pexels-photo-2735865.jpeg?auto=compress&cs=tinysrgb&w=600")`, // Replace with your image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '20px',
          fontFamily: 'Arial, sans-serif',
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly transparent background for form
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>
        Calcul de l'énergie éolienne
        </h1>
        <div>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Avez-vous utilisé Éolien?
            <input
              type="radio"
              value="yes"
              checked={elUsed === 'yes'}
              onChange={() => setElUsed('yes')}
            />{' '}
            Oui
            <input
              type="radio"
              value="no"
              checked={elUsed === 'no'}
              onChange={() => setElUsed('no')}
            />{' '}
            Non
          </label>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Votre facture d'électricité:
            <input
              type="text"
              value={electricityBill}
              onChange={(e) => setElectricityBill(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '5px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </label>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Superficie (m²):
            <input
              type="number"
              value={area}
              readOnly
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '5px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Vitesse du vent (m/s):
            <input
              type="number"
              value={w_s}
              readOnly
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '5px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </label>
        </div>
        <canvas ref={chartRef} style={{ display: 'none' }}></canvas>
        <button
          onClick={handleCalculate}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '20px',
          }}
        >
          Calculer
        </button>
        <div>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Production Éolienne:
            <input
              type="text"
              value={adjustedE}
              readOnly
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '5px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Puissance Éolienne:
            <input
              type="text"
              value={pEl}
              readOnly
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '5px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </label>
        </div>
        <button
          onClick={handleGeneratePdf}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '20px',
          }}
        >
          Télécharger le rapport
        </button>
      </div>
    </div>
  );
};

export default EL;
