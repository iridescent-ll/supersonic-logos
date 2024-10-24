import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, useParams, useModel } from '@umijs/max';
import DomainListTree from './components/DomainList';
import styles from './components/style.less';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { ISemantic } from './data';
import { getDomainList, getDataSetList } from './service';
import DomainManagerTab from './components/DomainManagerTab';
import { isArrayOfValues } from '@/utils/utils';

type Props = {
  mode: 'domain';
};

const OverviewContainer: React.FC<Props> = ({ mode }) => {
  const defaultTabKey = 'overview';
  // 'overview'  dataSetManage
  const params: any = useParams();
  const domainId = params.domainId;
  const modelId = params.modelId;
  const domainModel = useModel('SemanticModel.domainData');
  const modelModel = useModel('SemanticModel.modelData');
  const dimensionModel = useModel('SemanticModel.dimensionData');
  const metricModel = useModel('SemanticModel.metricData');
  const databaseModel = useModel('SemanticModel.databaseData');
  const { selectDomainId, domainList, setSelectDomain, setDomainList } = domainModel;
  const {
    selectModelId,
    modelList,
    MrefreshModelList,
    setSelectModel,
    setModelTableHistoryParams,
  } = modelModel;
  const { MrefreshDimensionList } = dimensionModel;
  const { MrefreshMetricList } = metricModel;
  const { MrefreshDatabaseList } = databaseModel;
  const menuKey = params.menuKey ? params.menuKey : !Number(modelId) ? defaultTabKey : '';
  const [isModel, setIsModel] = useState<boolean>(false);
  const [collapsedState, setCollapsedState] = useState(true);
  const [activeKey, setActiveKey] = useState<string>(menuKey);
  const [dataSetList, setDataSetList] = useState<ISemantic.IDatasetItem[]>([]);

  const initSelectedDomain = (domainList: ISemantic.IDomainItem[]) => {
    const targetNode = domainList.filter((item: any) => {
      return `${item.id}` === domainId;
    })[0];
    if (!targetNode) {
      const firstRootNode = domainList.filter((item: any) => {
        return item.parentId === 0;
      })[0];
      if (firstRootNode) {
        const { id } = firstRootNode;
        setSelectDomain(firstRootNode);
        setActiveKey(menuKey);
        pushUrlMenu(id, 0, menuKey);
      }
    } else {
      setSelectDomain(targetNode);
    }
  };

  const initProjectTree = async () => {
    const { code, data, msg } = await getDomainList();
    if (code === 200) {
      initSelectedDomain(data);
      setDomainList(data);
    } else {
      message.error(msg);
    }
  };

  useEffect(() => {
    initProjectTree();
    MrefreshDatabaseList();
    return () => {
      setSelectDomain(undefined);
      setSelectModel(undefined);
    };
  }, []);

  useEffect(() => {
    if (!selectDomainId) {
      return;
    }
    queryModelList();
    queryDataSetList();
  }, [selectDomainId]);

  const queryDataSetList = async () => {
    const { code, data, msg } = await getDataSetList(selectDomainId);
    if (code === 200) {
      setDataSetList(data);
      if (!isArrayOfValues(data)) {
        setActiveKey(defaultTabKey);
      }
    } else {
      message.error(msg);
    }
  };

  const queryModelList = async () => {
    await MrefreshModelList(selectDomainId);
  };

  useEffect(() => {
    if (!selectDomainId) {
      return;
    }
    setIsModel(false);
  }, [domainList, selectDomainId]);

  const initModelConfig = () => {
    setIsModel(true);
    const currentMenuKey = menuKey === defaultTabKey ? '' : menuKey;
    pushUrlMenu(selectDomainId, selectModelId, currentMenuKey);
    setActiveKey(currentMenuKey);
  };

  useEffect(() => {
    if (!selectModelId) {
      return;
    }
    initModelConfig();
    MrefreshDimensionList({ modelId: selectModelId });
    MrefreshMetricList({ modelId: selectModelId });
  }, [selectModelId]);

  const pushUrlMenu = (domainId: number, modelId: number, menuKey: string) => {
    history.push(`/model/${domainId}/${modelId || 0}/${menuKey}`);
  };

  const handleModelChange = (model?: ISemantic.IModelItem) => {
    if (!model) {
      return;
    }
    if (`${model.id}` === `${selectModelId}`) {
      initModelConfig();
    }
    setSelectModel(model);
  };

  const cleanModelInfo = (domainId) => {
    setIsModel(false);
    setActiveKey(defaultTabKey);
    pushUrlMenu(domainId, 0, defaultTabKey);
    setSelectModel(undefined);
  };

  const handleCollapsedBtn = () => {
    setCollapsedState(!collapsedState);
  };

  return (
    <div className={styles.projectBody}>
      <div className={styles.projectManger}>
        <div className={`${styles.sider} ${!collapsedState ? styles.siderCollapsed : ''}`}>
          <div className={styles.treeContainer}>
            <DomainListTree
              createDomainBtnVisible={mode === 'domain' ? true : false}
              onTreeSelected={(domainData: ISemantic.IDomainItem) => {
                const { id } = domainData;
                cleanModelInfo(id);
                setSelectDomain(domainData);
                setModelTableHistoryParams({
                  [id]: {},
                });
              }}
              onTreeDataUpdate={() => {
                initProjectTree();
              }}
            />
          </div>

          <div
            className={styles.siderCollapsedButton}
            onClick={() => {
              handleCollapsedBtn();
            }}
          >
            {collapsedState ? <LeftOutlined /> : <RightOutlined />}
          </div>
        </div>
        <div className={styles.content}>
          {selectDomainId ? (
            <>
              <DomainManagerTab
                isModel={isModel}
                activeKey={activeKey}
                modelList={modelList}
                dataSetList={dataSetList}
                handleModelChange={(model) => {
                  handleModelChange(model);
                  MrefreshModelList(selectDomainId);
                }}
                onBackDomainBtnClick={() => {
                  cleanModelInfo(selectDomainId);
                }}
                onMenuChange={(menuKey) => {
                  setActiveKey(menuKey);
                  pushUrlMenu(selectDomainId, selectModelId, menuKey);
                }}
              />
            </>
          ) : (
            <h2 className={styles.mainTip}>请选择项目</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewContainer;
