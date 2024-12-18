// グローバル変数の定義
let currentNumber = 0;
// CPUs
const cpuBrandSelect = document.querySelector('select[name="cpu-brand"]');
const cpuModelSelect = document.querySelector('select[name="cpu-model"]');
const cpuBrands = new Set();
const cpuModels = new Map();
const cpuBenchmarks = new Map();

// GPU
const gpuBrandSelect = document.querySelector('select[name="gpu-brand"]');
const gpuModelSelect = document.querySelector('select[name="gpu-model"]');
const gpuBrands = new Set();
const gpuModels = new Map();

// RAM
const ramNumberSelect = document.querySelector('select[name="ram-number"]');
const ramBrandSelect = document.querySelector('select[name="ram-brand"]');
const ramModelSelect = document.querySelector('select[name="ram-model"]');
const ramHowMany = new Set();
const ramBrands = new Set();
const ramModels = new Map();

// STORAGE
const storageTypeSelect = document.querySelector('select[name="storage-type"]');
const storageCapacitySelect = document.querySelector(
  'select[name="storage-capacity"]',
);
const storageBrandSelect = document.querySelector(
  'select[name="storage-brand"]',
);
const storageModelSelect = document.querySelector(
  'select[name="storage-model"]',
);

// 全体の状態を管理するオブジェクトを定義
const systemState = {
  currentCpu: { brand: "未選択", model: "未選択", benchmark: 0 },
  currentGpu: { brand: "未選択", model: "未選択", benchmark: 0 },
  currentRam: {
    number: "未選択",
    brand: "未選択",
    model: "未選択",
    benchmark: 0,
  },
  currentStorage: {
    type: "未選択",
    capacity: "未選択",
    brand: "未選択",
    model: "未選択",
    benchmark: 0,
  },
};

// 選択肢を追加する共通関数
function populateSelectOptions(selectElement, options) {
  selectElement.innerHTML = '<option value="">選択　　　　　　　　</option>';
  options.forEach((optionValue) => {
    const option = document.createElement("option");
    option.value = optionValue;
    option.textContent = optionValue;
    selectElement.appendChild(option);
  });
}

// システム状態を更新する共通関数
function updateSystemState(category, key, value) {
  systemState[category][key] = value;
}

// 選択変更時の共通処理
function handleSelectChange(selectElement, category, key, callback) {
  selectElement.addEventListener("change", function () {
    updateSystemState(category, key, this.value);
    if (callback) callback(this.value);
  });
}

// CPUの処理
fetch(`https://api.recursionist.io/builder/computers?type=cpu`)
  .then((response) => response.json())
  .then((data) => {
    data.forEach((cpu) => {
      cpuBrands.add(cpu.Brand);
      if (!cpuModels.has(cpu.Brand)) {
        cpuModels.set(cpu.Brand, []);
      }
      cpuModels
        .get(cpu.Brand)
        .push({ model: cpu.Model, benchmark: cpu.Benchmark });
    });

    populateSelectOptions(cpuBrandSelect, Array.from(cpuBrands));

    handleSelectChange(
      cpuBrandSelect,
      "currentCpu",
      "brand",
      (selectedBrand) => {
        systemState.currentCpu.model = "未選択";
        const models = cpuModels.get(selectedBrand) || [];
        populateSelectOptions(
          cpuModelSelect,
          models.map((model) => model.model),
        );
      },
    );

    handleSelectChange(
      cpuModelSelect,
      "currentCpu",
      "model",
      (selectedModel) => {
        const models = cpuModels.get(systemState.currentCpu.brand);
        const selectedCpu = models.find(
          (model) => model.model === selectedModel,
        );
        systemState.currentCpu.benchmark = selectedCpu
          ? selectedCpu.benchmark
          : "不明";
        console.log(`CPUベンチマーク: ${systemState.currentCpu.benchmark}`);
      },
    );
  });

// GPUの処理
fetch(`https://api.recursionist.io/builder/computers?type=gpu`)
  .then((response) => response.json())
  .then((data) => {
    data.forEach((gpu) => {
      gpuBrands.add(gpu.Brand);
      if (!gpuModels.has(gpu.Brand)) {
        gpuModels.set(gpu.Brand, []);
      }
      gpuModels
        .get(gpu.Brand)
        .push({ model: gpu.Model, benchmark: gpu.Benchmark });
    });

    populateSelectOptions(gpuBrandSelect, Array.from(gpuBrands));

    handleSelectChange(
      gpuBrandSelect,
      "currentGpu",
      "brand",
      (selectedBrand) => {
        systemState.currentGpu.model = "未選択";
        const models = gpuModels.get(selectedBrand) || [];
        populateSelectOptions(
          gpuModelSelect,
          models.map((model) => model.model),
        );
      },
    );

    handleSelectChange(
      gpuModelSelect,
      "currentGpu",
      "model",
      (selectedModel) => {
        const models = gpuModels.get(systemState.currentGpu.brand);
        const selectedGpu = models.find(
          (model) => model.model === selectedModel,
        );
        systemState.currentGpu.benchmark = selectedGpu
          ? selectedGpu.benchmark
          : "不明";
        console.log(`GPUベンチマーク: ${systemState.currentGpu.benchmark}`);
      },
    );
  });

// RAMの処理----------------------------------------------------------ーーーーーーーーー
fetch(`https://api.recursionist.io/builder/computers?type=ram`)
  .then((response) => response.json())
  .then((data) => {
    data.forEach((ram) => {
      ramBrands.add(ram.Brand);
      if (!ramModels.has(ram.Brand)) {
        ramModels.set(ram.Brand, []);
      }
      // モデルとベンチマークを一緒に保存
      ramModels
        .get(ram.Brand)
        .push({ model: ram.Model, benchmark: ram.Benchmark });
    });
    // RAMの数を選択肢にするための処理
    getRamNumber();
    // RAMのブランドを選択肢にするための処理
    getRamBrand();
    // RAMの数を選択肢にするための処理
    function getRamNumber() {
      const numbers = Array.from(ramModels.values())
        .flat()
        .map((ram) => {
          const match = ram.model.match(/(\d+)x/);
          return match ? parseInt(match[1]) : null;
        })
        .filter((num) => num !== null);
      const howmanyNumbers = [...new Set(numbers)];
      howmanyNumbers.sort((a, b) => a - b);
      howmanyNumbers.forEach((number) => {
        const option = document.createElement("option");
        option.value = number;
        option.textContent = number;
        ramNumberSelect.appendChild(option);
      });
    }
    // RAMのブランドを選択肢にするための処理
    function getRamBrand() {
      ramBrands.forEach((brand) => {
        const option = document.createElement("option");
        option.value = brand;
        option.textContent = brand;
        ramBrandSelect.appendChild(option);
      });
    }
    // RAMの数を選択した時の処理
    ramNumberSelect.addEventListener("change", function () {
      // 状態を更新
      systemState.currentRam.brand = "未選択";
      systemState.currentRam.model = "未選択";
      // 選択肢を更新
      ramBrandSelect.innerHTML =
        '<option value="">選択　　　　　　　　</option>';
      ramModelSelect.innerHTML =
        '<option value="">選択　　　　　　　　</option>';
      const selectedNumber = parseInt(this.value);
      const filteredBrands = new Set();
      // RAMのブランドを選択肢にするための処理
      ramModels.forEach((models, brand) => {
        const hasMatchingModel = models.some((ram) => {
          const match = ram.model.match(/(\d+)x/);
          return match && parseInt(match[1]) === selectedNumber;
        });
        // 選択した数に合うブランドを選択肢にするための処理
        if (hasMatchingModel) {
          filteredBrands.add(brand);
        }
      });
      // 選択した数に合うブランドを選択肢にするための処理
      filteredBrands.forEach((brand) => {
        const option = document.createElement("option");
        option.value = brand;
        option.textContent = brand;
        ramBrandSelect.appendChild(option);
      });
      // 状態を更新
      systemState.currentRam.number = this.value;
      console.log(systemState.currentRam.number);
    });
    // RAMのブランドを選択した時の処理
    ramBrandSelect.addEventListener("change", function () {
      ramModelSelect.innerHTML =
        '<option value="">選択　　　　　　　　</option>';
      const selectedBrand = this.value;
      const models = ramModels.get(selectedBrand) || [];

      models.forEach((ram) => {
        const match = ram.model.match(/(\d+)x/);
        const modelNumber = match ? parseInt(match[1]) : null;
        if (modelNumber === parseInt(ramNumberSelect.value)) {
          const option = document.createElement("option");
          option.value = ram.model;
          option.textContent = ram.model;
          ramModelSelect.appendChild(option);
        }
      });
      systemState.currentRam.brand = this.value;
      console.log(systemState.currentRam.brand);
    });
    // RAMのモデルを選択した時の処理
    ramModelSelect.addEventListener("change", function () {
      systemState.currentRam.model = this.value;

      // 選択されたRAMモデルのベンチマークを取得して表示
      const selectedModel = this.value;
      const models = ramModels.get(systemState.currentRam.brand);
      const selectedRam = models.find((ram) => ram.model === selectedModel);
      const ramBenchmark = selectedRam ? selectedRam.benchmark : "不明";
      systemState.currentRam.benchmark = ramBenchmark;
      console.log(`RAMベンチマーク: ${ramBenchmark}`);

      console.log(systemState.currentRam.model);
    });
  });

// STORAGEの処理------------------------------------------------------------------------------------------------
Promise.all([
  fetch(`https://api.recursionist.io/builder/computers?type=hdd`).then(
    (response) => response.json(),
  ),
  fetch(`https://api.recursionist.io/builder/computers?type=ssd`).then(
    (response) => response.json(),
  ),
]).then(([hdd, ssd]) => {
  const combinedData = [...hdd, ...ssd];

  const hddData = combinedData.filter((item) => item.Type === "HDD");
  const ssdData = combinedData.filter((item) => item.Type === "SSD");

  // ストレージの容量を選択肢にするための処理
  function getStorageCapacity(data) {
    const capacities = [
      ...new Set(
        data
          .map((item) => {
            const model = item.Model;
            return model.substring(model.lastIndexOf(" ") + 1);
          })
          .filter((suffix) => /TB|GB/.test(suffix)),
      ),
    ];
    capacities.sort((a, b) => {
      const aValue = a.includes("TB") ? parseFloat(a) * 1024 : parseFloat(a);
      const bValue = b.includes("TB") ? parseFloat(b) * 1024 : parseFloat(b);
      return aValue - bValue;
    });
    return capacities;
  }
  // ストレージのブランドを選択肢にするための処理
  function getStorageBrand(type) {
    const brands = [
      ...new Set(
        (type === "hdd" ? hddData : ssdData).map((item) => item.Brand),
      ),
    ];
    brands.forEach((brand) => {
      const option = document.createElement("option");
      option.value = brand;
      option.textContent = brand;
      storageBrandSelect.appendChild(option);
    });
  }
  // ストレージのモデルを選択肢にするための処理
  function getStorageModel() {
    const currentType = systemState.currentStorage.type;
    const currentBrand = systemState.currentStorage.brand;
    const currentCapacity = systemState.currentStorage.capacity;

    const data = currentType === "hdd" ? hddData : ssdData;
    const models = data
      .filter(
        (item) =>
          item.Brand === currentBrand && item.Model.includes(currentCapacity),
      )
      .map((item) => ({ model: item.Model, benchmark: item.Benchmark }));

    models.forEach((model) => {
      const option = document.createElement("option");
      option.value = model.model;
      option.textContent = `${model.model}`;
      storageModelSelect.appendChild(option);
    });
  }

  function initializeStorageOptions() {
    handleSelectChange(storageTypeSelect, "currentStorage", "type", (type) => {
      const data = type === "hdd" ? hddData : ssdData;
      populateSelectOptions(storageCapacitySelect, getStorageCapacity(data));
      getStorageBrand(type);
    });

    handleSelectChange(
      storageCapacitySelect,
      "currentStorage",
      "capacity",
      () => {
        if (systemState.currentStorage.brand !== "未選択") {
          getStorageModel();
        }
      },
    );

    handleSelectChange(
      storageBrandSelect,
      "currentStorage",
      "brand",
      getStorageModel,
    );

    handleSelectChange(
      storageModelSelect,
      "currentStorage",
      "model",
      (model) => {
        const data =
          systemState.currentStorage.type === "hdd" ? hddData : ssdData;
        const selectedStorage = data.find((item) => item.Model === model);
        systemState.currentStorage.benchmark = selectedStorage
          ? selectedStorage.Benchmark
          : "不明";
        console.log(
          `ストレージベンチマーク: ${systemState.currentStorage.benchmark}`,
        );
      },
    );
  }

  initializeStorageOptions();
});

// PCの追���ボタンが押された時の処理------------------------------------------------------------------------------------------------
document.getElementById("add-pc-btn").addEventListener("click", function () {
  const pcListContainer = document.getElementById("pc-list-container");
  currentNumber += 1;

  const gamingBenchmark =
    Math.round(systemState.currentCpu.benchmark * 0.25) +
    Math.round(systemState.currentGpu.benchmark * 0.6) +
    Math.round(systemState.currentRam.benchmark * 0.125) +
    Math.round(systemState.currentStorage.benchmark * 0.025);
  console.log(gamingBenchmark);
  const workBenchmark =
    Math.round(systemState.currentCpu.benchmark * 0.6) +
    Math.round(systemState.currentGpu.benchmark * 0.25) +
    Math.round(systemState.currentRam.benchmark * 0.1) +
    Math.round(systemState.currentStorage.benchmark * 0.05);
  console.log(workBenchmark);

  const newPCItem = document.createElement("div");
  newPCItem.classList.add("pc-list", "mb-4");
  newPCItem.innerHTML = `
      <div class="d-flex bg-primary justify-content-center p-3">
        <h2 class="text-white me-3">YourPC</h2>
        <h2 class="text-white">${currentNumber}</h2>
      </div>
      <div class="bg-primary p-5">
        <div class="mb-4">  
          <h3 class="fw-bold">CPU</h3>
          <div class="d-flex">
            <p class="mb-0 me-2">Brand:</p>
            <p class="mb-0">${systemState.currentCpu.brand || "未選択"}</p>
          </div>
          <div class="d-flex">
            <p class="mb-0 me-2">Model:</p>
            <p class="mb-0">${systemState.currentCpu.model || "未選択"}</p>
          </div>
        </div>
        <div class="mb-4">
          <h3 class="fw-bold">GPU</h3>
          <div class="d-flex">
            <p class="mb-0 me-2">Brand:</p>
              <p class="mb-0">${systemState.currentGpu.brand || "未選択"}</p>
          </div>
          <div class="d-flex">
            <p class="mb-0 me-2">Model:</p>
            <p class="mb-0">${systemState.currentGpu.model || "未選択"}</p>
          </div>
        </div>
        <div class="mb-4">
          <h3 class="fw-bold">RAM</h3>
          <div class="d-flex">
            <p class="mb-0 me-2">Brand:</p>
            <p class="mb-0">${systemState.currentRam.brand || "未選択"}</p>
          </div>
          <div class="d-flex">
            <p class="mb-0 me-2">Model:</p>
            <p class="mb-0">${systemState.currentRam.model || "未選択"}</p>
          </div>
        </div>
        <div class="mb-4">
          <h3 class="fw-bold">Storage</h3>
          <div class="d-flex">
            <p class="mb-0 me-2">Type:</p>
            <p class="mb-0">${systemState.currentStorage.type || "未選択"}</p>
          </div>
          <div class="d-flex">
            <p class="mb-0 me-2">Capacity:</p>
            <p class="mb-0">${systemState.currentStorage.capacity || "未選択"}</p>
          </div>
          <div class="d-flex">
            <p class="mb-0 me-2">Brand:</p>
            <p class="mb-0">${systemState.currentStorage.brand || "未選択"}</p>
          </div>
          <div class="d-flex">
            <p class="mb-0 me-2">Model:</p>
            <p class="mb-0">${systemState.currentStorage.model || "未選択"}</p>
          </div>
        </div>
      </div>
      <div id="pc-performance" class="bg-primary">
        <div class="d-flex text-center col-12 mx-auto">
          <p class="col-6">Gaming: ${gamingBenchmark}%</p>
          <p class="col-6">Work: ${workBenchmark}%</p>
        </div>
      </div>
    `;
  pcListContainer.appendChild(newPCItem);
});
