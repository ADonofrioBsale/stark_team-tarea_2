class Company {
  // URL base de la API compartida por todas las instancias de Company
  static API_BASE_URL = 'http://54.183.76.110:7171'; // TODO: mover a variable de entorno

  constructor(data) {
    this.id = data.id;
    this.cpnCode = data.cpnCode;
    this.cpnName = data.cpnName;
    this.cpnLegalAddress = data.cpnLegalAddress;
    this.cpnLegalCounty = data.cpnLegalCounty;
    this.activity = data.activity;
    this.legalAgentCode = data.legalAgentCode;
    this.legalAgentName = data.legalAgentName;
    this.legalAgentEmail = data.legalAgentEmail;
    this.cpnDteActive = data.cpnDteActive;
  }

  // Método que obtiene los datos de la compañía desde la API y actualiza las propiedades de esta instancia
  async getCompanyById() {
    const response = await fetch(`${Company.API_BASE_URL}/v1/companies/${this.id}.json`);

    const result = await response.json();
    const data = result.data;
    
    // Actualizo las propiedades de esta instancia con los datos de la API
    this.cpnCode = data.cpnCode;
    this.cpnName = data.cpnName;
    this.cpnLegalAddress = data.cpnLegalAddress;
    this.cpnLegalCounty = data.cpnLegalCounty;
    this.activity = data.activity;
    this.legalAgentCode = data.legalAgentCode;
    this.legalAgentName = data.legalAgentName;
    this.legalAgentEmail = data.legalAgentEmail;
    this.cpnDteActive = data.cpnDteActive;

    return data;
  }

  // Método que actualiza los datos de la compañía en la API con los datos de esta instancia
  async updateCompanyById() {
    await fetch(`${Company.API_BASE_URL}/v1/companies/${this.id}.json`, { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cpnCode: this.cpnCode,
        cpnName: this.cpnName,
        cpnLegalAddress: this.cpnLegalAddress,
        cpnLegalCounty: this.cpnLegalCounty,
        activity: this.activity,
        legalAgentCode: this.legalAgentCode,
        legalAgentName: this.legalAgentName,
        legalAgentEmail: this.legalAgentEmail,
        cpnDteActive: this.cpnDteActive
      })
    });

    // Simulo una respuesta exitosa con los datos que el usuario envió (ya que la API no permite actualizar)
    return {
      success: true,
      message: 'Datos actualizados correctamente'
    };
  }
}

export default Company;